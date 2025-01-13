import prisma from '../db/prisma.js';
import { Prisma } from '@prisma/client';
import { Order, OrderItem, OrderStatus, PaymentStatus, CreateOrderRequest, OrderFilterOptions, OrderSummary} from '../types/order.types.js';

export class OrderModel {

    //

    // create new order with items
    static async createOrder(orderData: CreateOrderRequest): Promise<Order> {
        try {
            const transaction = await prisma.$transaction(async (tx) => {
                // calculate order total from items
                const orderTotal = orderData.items.reduce((total, item) => {
                    return total.add(new Prisma.Decimal(item.unitPrice).mul(item.quantity));
                }, new Prisma.Decimal(0));

                // create order
                const order = await tx.order.create({
                    data: {
                        userId: orderData.userId,
                        orderTotal,
                        shippingId: orderData.shippingId,
                        orderItems: {
                            create: orderData.items.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                unitPrice: new Prisma.Decimal(item.unitPrice),
                                subtotal: new Prisma.Decimal(item.unitPrice).mul(item.quantity)
                            }))
                        }
                    },
                    include: {
                        orderItems: true
                    }
                });

                // loop product stock quantities and update products
                for (const item of orderData.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stockQuantity: {
                                decrement: item.quantity
                            }
                        }
                    });
                }

                return {
                    orderId: order.id,
                    userId: order.userId,
                    orderDate: order.orderDate,
                    orderTotal: order.orderTotal,
                    orderStatus: order.orderStatus as OrderStatus,
                    paymentStatus: order.paymentStatus as PaymentStatus,
                    lastUpdated: order.lastUpdated,
                    shippingId: order.shippingId ?? undefined,
                    items: order.orderItems.map(item => ({
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
            });

            return transaction;

        } catch (error: any) {

            throw new Error(`Error creating order: ${error.message}`);
            
        }
    }

    // get order by id
    static async getOrderById(orderId: string): Promise<Order | null>{
        try {

            // check if order exists
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    orderItems: true
                },
                
            });

            if (!order) {
                return null;
            }

            return {
                orderId: order.id,
                userId: order.userId,
                orderDate: order.orderDate,
                orderTotal: order.orderTotal,
                orderStatus: order.orderStatus as OrderStatus,
                paymentStatus: order.paymentStatus as PaymentStatus,
                lastUpdated: order.lastUpdated,
                shippingId: order.shippingId ?? undefined,
                items: order.orderItems.map(item => ({
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

            
        } catch (error: any) {

            throw new Error(`Error getting order: ${error.message}`);
        }
    }

    // get orders with filtering and pagination
    static async getOrders(options: OrderFilterOptions = {}): Promise<{ orders: Order[], total: number }> {
        try {
            const {
                userId,
                orderStatus,
                paymentStatus,
                startDate,
                endDate,
                minTotal,
                maxTotal,
                sortBy = 'orderDate',
                sortOrder = 'desc',
                page = 1,
                limit = 10
            } = options;

            const where: Prisma.OrderWhereInput = {};

            if (userId) {
                where.userId = userId;
            }

            if (orderStatus) {
                where.orderStatus = orderStatus;
            }

            if (paymentStatus) {
                where.paymentStatus = paymentStatus;
            }

            if (startDate || endDate) {
                where.orderDate = {
                    gte: startDate,
                    lte: endDate
                };
            }

            if (minTotal || maxTotal) {
                where.orderTotal = {
                    gte: minTotal ? new Prisma.Decimal(minTotal) : undefined,
                    lte: maxTotal ? new Prisma.Decimal(maxTotal) : undefined
                };
            }

            const total = await prisma.order.count({ where });

            const orders = await prisma.order.findMany({
                where,
                include: {
                    orderItems: true
                },
                orderBy: {
                    [sortBy]: sortOrder,
                    orderDate: 'desc'
                },
                skip: (page - 1) * limit,
                take: limit
            });

            return {
                orders: orders.map(order => ({
                    orderId: order.id,
                    userId: order.userId,
                    orderDate: order.orderDate,
                    orderTotal: order.orderTotal,
                    orderStatus: order.orderStatus as OrderStatus,
                    paymentStatus: order.paymentStatus as PaymentStatus,
                    lastUpdated: order.lastUpdated,
                    shippingId: order.shippingId ?? undefined,
                    items: order.orderItems.map(item => ({
                        orderItemId: item.id,
                        orderId: item.orderId,
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        subtotal: item.subtotal,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
                    }))
                })),
                total
            };
            
        } catch (error: any) {

            throw new Error(`Error getting orders: ${error.message}`);
            
        }
    }

    // update order status
    static async updateOrderStatus(orderId: string, orderStatus: OrderStatus, paymentStatus?: PaymentStatus): Promise<Order>{
        try {
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

            return {
                orderId: order.id,
                userId: order.userId,
                orderDate: order.orderDate,
                orderTotal: order.orderTotal,
                orderStatus: order.orderStatus as OrderStatus,
                paymentStatus: order.paymentStatus as PaymentStatus,
                lastUpdated: order.lastUpdated,
                shippingId: order.shippingId ?? undefined,
                items: order.orderItems.map(item => ({
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
        } catch (error: any) {

            throw new Error(`Error updating order status: ${error.message}`);
            
        }
    }

    // cancel order and restore stock
    static async cancelOrder(orderId: string): Promise<Order> {
        try {
            return await prisma.$transaction(async (tx) => {
                // get order and order items
                const order = await tx.order.findUnique({
                    where: {
                        id: orderId,
                        orderStatus: {
                            notIn: [OrderStatus.DELIVERED, 
                                    OrderStatus.CANCELLED,
                                    OrderStatus.REFUNDED]
                        }
                    },
                    include: {
                        orderItems: true
                    }
                });

                if (!order) {
                    throw new Error('Order not found or cannot be cancelled');
                }

                // restore stock quantities
                for (const item of order.orderItems) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stockQuantity: {
                                increment: item.quantity
                            }
                        }
                    });
                }

                // update order status
                const updatedOrder = await tx.order.update({
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

                return {
                    orderId: updatedOrder.id,
                    userId: updatedOrder.userId,
                    orderDate: updatedOrder.orderDate,
                    orderTotal: updatedOrder.orderTotal,
                    orderStatus: updatedOrder.orderStatus as OrderStatus,
                    paymentStatus: updatedOrder.paymentStatus as PaymentStatus,
                    lastUpdated: updatedOrder.lastUpdated,
                    shippingId: updatedOrder.shippingId ?? undefined,
                    items: updatedOrder.orderItems.map(item => ({
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

            });
            
        } catch (error: any) {

            throw new Error(`Error cancelling order: ${error.message}`);
            
        }
    }

    // get order summary
    static async getOrderSummary(userId?: string, startDate?: Date, endDate?: Date): Promise<OrderSummary> {
        try {
            const where: Prisma.OrderWhereInput = {};

            if (userId) {
                where.userId = userId;
            }

            if (startDate || endDate) {
                where.orderDate = {
                    gte: startDate,
                    lte: endDate
                };
            }

            const [orderCount, totalAmount, statusCounts ] = await Promise.all([

                // get total order count
                prisma.order.count({ where }),

                // get total revenue
                prisma.order.aggregate({
                    where,
                    _sum: {
                        orderTotal: true
                    }
                }),

                // get counts by status
                prisma.order.groupBy({
                    by: ['orderStatus'],
                    where,
                    _count: true

                })
            ]);

            const totalRevenue = totalAmount._sum.orderTotal || new Prisma.Decimal(0);
            const averageOrderValue = orderCount > 0 ? totalRevenue.div(orderCount) : new Prisma.Decimal(0);

            // initialize status counts
            const ordersByStatus = Object.values(OrderStatus).reduce((acc, status) => {
                acc[status] = 0;
                return acc;
            }, {} as Record<OrderStatus, number>);

            // fill in actual counts
            statusCounts.forEach(({ orderStatus, _count }) => {
                ordersByStatus[orderStatus as OrderStatus] = _count;
            });

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

    // get user order history
    static async getUserOrderHistory(userId: string, limit: number = 10, cursor?: string): Promise<Order[]> {
        try {
            const orders = await prisma.order.findMany({
                where: { userId },
                take: limit,
                skip: cursor ? 1 : 0,
                orderBy: {orderDate: 'desc'},
                include: { orderItems: true }

            })

            return orders.map(order => ({
                orderId: order.id,
                userId: order.userId,
                orderDate: order.orderDate,
                orderTotal: order.orderTotal,
                orderStatus: order.orderStatus as OrderStatus,
                paymentStatus: order.paymentStatus as PaymentStatus,
                lastUpdated: order.lastUpdated,
                shippingId: order.shippingId ?? undefined,
                items: order.orderItems.map(item => ({
                    orderItemId: item.id,
                    orderId: item.orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.subtotal,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }))
            }));
            
        } catch (error: any) {

            throw new Error(`Error getting user order history: ${error.message}`);
            
        }
    }
}