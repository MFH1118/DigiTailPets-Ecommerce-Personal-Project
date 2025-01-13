// src/controllers/order.controller.ts

import { Request, Response } from 'express';
import { OrderModel } from '../model/order.model.js';
import { ErrorResponse, CreateOrderRequest, OrderStatus, PaymentStatus } from '../types/order.types.js';

export class OrderController {
    
    // Customers

    // create new order
    static async createCustomerOrder(req: Request, res: Response) {
        try {
            const userId = req.user?.userId as string;
            const orderData: CreateOrderRequest = { userId, items: req.body.items, shippingId: req.body.shippingId };

            const newOrder = await OrderModel.createOrder(orderData);

            return res.status(201).json({
                message: 'Order created successfully',
                order: newOrder
            })
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error creating order',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
            
        }
    }

    // get customer order
    static async getCustomerOrder(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const orderId = req.params.orderId;

            const order = await OrderModel.getOrderById(orderId);

            if(!order) {
                const errorResponse: ErrorResponse = {
                    error: 'Order not found'
                };

                return res.status(404).json(errorResponse);
            }

            // verify that the order belongs to the user
            if (order.userId !== userId) {
                const errorResponse: ErrorResponse = {
                    error: 'Unauthorized access to order',
                    details: 'You do not have permission to access this order'
                };

                return res.status(403).json(errorResponse);
            }

            return res.status(200).json({ order });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching order',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }

            return res.status(500).json(errorResponse);
            
        }
    }

    // get customer order history
    static async getCustomerOrderHistory(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const cursor = req.query.cursor as string | undefined;

            const orders = await OrderModel.getUserOrderHistory(userId, limit, cursor);

            return res.status(200).json({ 
                orders,
                nextCursor : orders.length === limit ? orders[orders.length - 1].orderId : undefined 
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching order history',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }

            return res.status(500).json(errorResponse);
        }
    }

    // cancel customer order
    static async cancelCustomerOrder(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const orderId = req.params.orderId;

            // verify that the order belongs to the user
            const order = await OrderModel.getOrderById(orderId);

            if (!order) {
                const errorResponse: ErrorResponse = {
                    error: 'Order not found'
                };

                return res.status(404).json(errorResponse);
            }

            if (order.userId !== userId) {
                const errorResponse: ErrorResponse = {
                    error: 'Unauthorized access to order',
                    details: 'You do not have permission to access this order'
                };

                return res.status(403).json(errorResponse);
            }

            if (![OrderStatus.PENDING, OrderStatus.PROCESSING].includes(order.orderStatus)) {
                const errorResponse: ErrorResponse = {
                    error: 'Order cannot be cancelled',
                    details: 'Only pending or processing orders can be cancelled'
                };
                return res.status(400).json(errorResponse);
            }

            const cancelledOrder = await OrderModel.cancelOrder(orderId);

            return res.status(200).json({
                message: 'Order cancelled successfully',
                order: cancelledOrder
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error cancelling order',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }

            return res.status(500).json(errorResponse);
            
        }
    }

}