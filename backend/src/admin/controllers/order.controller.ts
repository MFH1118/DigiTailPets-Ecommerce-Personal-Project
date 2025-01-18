// src/admin/controllers/order.controller.ts

import { Request, Response } from 'express';
import { OrderModel } from '../../model/order.model.js';
import { ErrorResponse, OrderStatus, PaymentStatus } from '../../types/order.types.js';

export class AdminOrderController {
    // Admins

    // get all orders
    static async getAllOrders(req: Request, res: Response): Promise<Response> {
        try {
            const {
                userId,
                orderStatus,
                paymentStatus,
                startDate,
                endDate,
                minTotal,
                maxTotal,
                sortBy,
                sortOrder,
                page,
                limit
            } = req.query;

            const result = await OrderModel.getAllOrders({
                userId: userId as string,
                orderStatus: orderStatus as OrderStatus,
                paymentStatus: paymentStatus as PaymentStatus,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                minTotal: minTotal ? Number(minTotal) : undefined,
                maxTotal: maxTotal ? Number(maxTotal) : undefined,
                sortBy: sortBy as any,
                sortOrder: sortOrder as 'asc' | 'desc',
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined
            });

            return res.status(200).json(result);
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching orders',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // get order by id
    static async getOrderById(req: Request, res: Response): Promise<Response> {
        try {
            const orderId = req.params.orderId;
            const order = await OrderModel.getOrderById(orderId);

            if (!order) {
                const errorResponse: ErrorResponse = {
                    error: 'Order not found'
                };
                return res.status(404).json(errorResponse);
            }

            return res.status(200).json({ order });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching order',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // update order status
    static async updateOrderStatus(req: Request, res: Response): Promise<Response> {
        try {
            const orderId = req.params.orderId;
            const { orderStatus, paymentStatus } = req.body;

            // check if order provided
            if (!orderId) {
                const errorResponse: ErrorResponse = {
                    error: 'Order ID is required'
                };
                return res.status(400).json(errorResponse);
            }

            // check if fields are valid
            if (!orderStatus || !paymentStatus) {
                const errorResponse: ErrorResponse = {
                    error: 'Order status and payment status are required'
                };
                return res.status(400).json(errorResponse);
            }

            const updatedOrder = await OrderModel.updateOrderStatus(
                orderId,
                orderStatus,
                paymentStatus
            );

            return res.status(200).json({
                message: 'Order status updated successfully',
                order: updatedOrder
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error updating order status',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }
    
    // get order summary
    static async getOrderSummary(req: Request, res: Response): Promise<Response> {
        try {
            const { userId, startDate, endDate } = req.query;

            const summary = await OrderModel.getOrderSummary(
                userId as string | undefined,
                startDate ? new Date(startDate as string) : undefined,
                endDate ? new Date(endDate as string) : undefined
            );

            return res.status(200).json({ summary });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error generating order summary',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

}