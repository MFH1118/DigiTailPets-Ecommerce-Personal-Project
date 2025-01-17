// src/admin/routes/admin/order.routes.ts

import express, { Router } from 'express';
import { AdminOrderController } from '../controllers/order.controller.js';
import { authenticateUser, isAdmin } from '../../middleware/auth.middleware.js';
import { validateOrderStatusUpdate } from '../../middleware/validate.middleware.js';

const router: Router = express.Router();

// require authentication and admin role for all routes
router.use(authenticateUser, isAdmin);

// admin order management routes

// get all orders
router.get('/', AdminOrderController.getAllOrders);

// get order summary
router.get('/summary', AdminOrderController.getOrderSummary);

// get order by id
router.get('/:orderId', AdminOrderController.getOrderById);

// update order status
router.patch('/:orderId/status', validateOrderStatusUpdate, AdminOrderController.updateOrderStatus);

export default router;