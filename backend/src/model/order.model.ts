import prisma from '../db/prisma.js';
import { Prisma } from '@prisma/client';
import { Order, OrderItem, OrderStatus, PaymentStatus, CreateOrderRequest, OrderFilterOptions, OrderSummary} from '../types/order.types.js';

export class OrderModel {
    
    // private common order response
    private static orderResponse(order: any): Order {
        return {
            orderId: order.id,
            userId: order.userId,
            orderDate: order.orderDate,
            orderTotal: order.orderTotal,
            orderStatus: order.orderStatus as OrderStatus,
            paymentStatus: order.paymentStatus as PaymentStatus,
            lastUpdated: order.lastUpdated,
            shippingId: order.shippingId ?? undefined,
            items: order.orderItems.map((item: any) => ({
                orderItemId: item.id,
                orderId: item.orderId,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.subtotal,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }))
        };
    }

    // private order status count
    private static initializeOrderStatusCounts(statusCounts: { orderStatus: string; _count: number; }[]): Record<OrderStatus, number> {
        const ordersByStatus = Object.values(OrderStatus).reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {} as Record<OrderStatus, number>);

        statusCounts.forEach(({ orderStatus, _count }) => {
            ordersByStatus[orderStatus as OrderStatus] = _count;
        });

        return ordersByStatus;
    }

    // customer functions

    // customer create order 
    static async createOrder(orderData: CreateOrderRequest): Promise<Order> {
        try {
            // validate product availability
            const productsAvailability = await prisma.product.findMany({
                where: {
                    id: { in: orderData.items.map(item => item.productId) },
                    isActive: true,
                    stockQuantity: { gt: 0 }
                },
                select: {
                    id: true,
                    stockQuantity: true,
                    price: true
                }
            });

            // map products
            const productMap = new Map(
                productsAvailability.map(p => [p.id, { stock: p.stockQuantity, price: p.price }])
            );

            // validate all products exist and have sufficient stock
            for (const item of orderData.items) {
                const product = productMap.get(item.productId);
                if (!product) {
                    throw new Error(`Product ${item.productId} is not available`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${item.productId}`);
                }
            }

            // calculate order total
            const orderTotal = orderData.items.reduce((total, item) => {
                const product = productMap.get(item.productId)!;
                return total.add(product.price.mul(item.quantity));
            }, new Prisma.Decimal(0));

            // create order
            const order = await prisma.order.create({
                data: {
                    userId: orderData.userId,
                    orderTotal,
                    orderStatus: OrderStatus.PENDING,
                    shippingId: orderData.shippingId,
                    orderItems: {
                        create: orderData.items.map(item => {
                            const product = productMap.get(item.productId)!;
                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                unitPrice: product.price,
                                subtotal: product.price.mul(item.quantity)
                            };
                        })
                    }
                },
                include: {
                    orderItems: true
                }
            });

            return this.orderResponse(order);
            
        } catch (error: any) {
            throw new Error(`Error creating order: ${error.message}`);
        }
    }

    // get customer order
    static async getCustomerOrder(orderId: string, userId: string): Promise<Order | null> {
        try {
            
            // find the order of the customer
            const order = await prisma.order.findFirst({
                where: {
                    id: orderId,
                    userId: userId
                },
                include: {
                    orderItems: true
                }
            });

            // check if the order is not found
            if (!order) {

                return null;

            } 

            // return the order
            return this.orderResponse(order);

        } catch (error: any) {
            throw new Error(`Error getting customer order: ${error.message}`);
        }
    }

    // get customer order history
    static async getCustomerOrderHistory(userId: string, limit: number = 10, cursor?: string): Promise<Order[]> {
        try {
            // find all orders of the customer
            const orders = await prisma.order.findMany({
                where: { userId },
                take: limit,
                skip: cursor ? 1 : 0,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: { orderDate: 'desc' },
                include: { orderItems: true }
            });

            // return a map of all customer orders 
            return orders.map(order => this.orderResponse(order));

        } catch (error: any) {
            throw new Error(`Error getting user order history: ${error.message}`);
        }
    }

    // cancel customer order
    static async cancelCustomerOrder(orderId: string, userId: string): Promise<Order> {
        try {

            // find the order of the customer
            const order = await prisma.order.findFirst({
                where: {
                    id: orderId,
                    userId: userId,
                    orderStatus: {
                        notIn: [OrderStatus.CANCELLED, OrderStatus.DELIVERED, OrderStatus.REFUNDED]
                    }
                },
                include: {
                    orderItems: true
                }
            });

            // check if the order is not found
            if (!order) {
                throw new Error('Order not found');
            }

            // cancel the order
            const cancelledOrder = await prisma.order.update({
                where: { id: orderId },
                data: {
                    orderStatus: OrderStatus.CANCELLED,
                    paymentStatus: PaymentStatus.CANCELLED,
                    lastUpdated: new Date()
                },
                include: { 
                    orderItems: true
                }
            });

            return this.orderResponse(cancelledOrder);
            
        } catch (error: any) {
            throw new Error(`Error cancelling customer order: ${error.message}`);
            
        }
    }

    // admin functions

    // get all orders
    static async getAllOrders(options: OrderFilterOptions = {}): Promise<{orders: Order[], total: number}>{
        try {

            // initialise where clause
            const where: Prisma.OrderWhereInput = {};

            // build where clause
            if (options.userId) {
                where.userId = options.userId;
            }

            if (options.orderStatus) {
                where.orderStatus = options.orderStatus;
            }

            if (options.paymentStatus) {
                where.paymentStatus = options.paymentStatus;
            }

            if(options.startDate || options.endDate) {
                where.orderDate = {
                    gte: options.startDate,
                    lte: options.endDate
                };
            }

            if (options.minTotal || options.maxTotal) {
                where.orderTotal = {
                    gte: options.minTotal ? new Prisma.Decimal(options.minTotal) : undefined,
                    lte: options.maxTotal ? new Prisma.Decimal(options.maxTotal) : undefined
                }
            }

            // find all orders
            const [orders, total] = await Promise.all([
                prisma.order.findMany({
                    where,
                    include: {
                        orderItems: true
                    },
                    orderBy: {
                        [options.sortBy || 'orderDate']: options.sortOrder || 'desc'
                    },
                    skip: options.page ? (options.page - 1) * (options.limit || 10) : undefined,
                    take: options.limit
                }),
                prisma.order.count({ where })
            ]);

            // return orders
            return {
                orders: orders.map(order => this.orderResponse(order)),
                total
            }
            
        } catch (error: any) {
            throw new Error(`Error getting all orders: ${error.message}`);
            
        }
    }

    // get order by order id
    static async getOrderById(orderId: string): Promise<Order | null> {
        try {

            // find the order
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { 
                    orderItems: true 
                }
            });

            // check if the order is not found
            if (!order){
                return null;
            } 

            // return the order
            return this.orderResponse(order);

        } catch (error: any) {
            throw new Error(`Error getting order: ${error.message}`);

        }
    }

    // update order status
    static async updateOrderStatus(orderId: string, orderStatus: OrderStatus, paymentStatus?: PaymentStatus): Promise<Order> {
        try {

            // update order status
            const order = await prisma.order.update({
                where: { id: orderId },
                data: {
                    orderStatus,
                    paymentStatus,
                    lastUpdated: new Date()
                },
                include: { 
                    orderItems: true 
                }
            });

            // return the updated order
            return this.orderResponse(order);

        } catch (error: any) {
            throw new Error(`Error updating order status: ${error.message}`);

        }
    }

    // get order summary
    static async getOrderSummary(userId?: string, startDate?: Date, endDate?: Date): Promise<OrderSummary> {
        try {

            // initialise where clause
            const where: Prisma.OrderWhereInput = {};

            // build where clause
            if (userId) {
                where.userId = userId;
            }

            if (startDate || endDate) {
                where.orderDate = {
                    gte: startDate,
                    lte: endDate
                };
            }

            // get order summary
            const [orderCount, totalAmount, statusCounts] = await Promise.all([
                prisma.order.count({ where }),
                prisma.order.aggregate({
                    where,
                    _sum: { orderTotal: true }
                }),
                prisma.order.groupBy({
                    by: ['orderStatus'],
                    where,
                    _count: true
                })
            ]);

            // calculate total revenue, average order value and orders by status
            const totalRevenue = totalAmount._sum.orderTotal || new Prisma.Decimal(0);
            const averageOrderValue = orderCount > 0 ? totalRevenue.div(orderCount) : new Prisma.Decimal(0);

            const ordersByStatus = this.initializeOrderStatusCounts(statusCounts);

            return {
                totalOrders: orderCount,
                totalRevenue,
                averageOrderValue,
                ordersByStatus
            };
        } catch (error: any) {
            throw new Error(`Error getting order summary: ${error.message}`);
        }
    }

}