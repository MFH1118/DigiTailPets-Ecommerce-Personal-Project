// src/routes/order.routes.ts

import express, { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateOrderInput } from '../middleware/validate.middleware.js';

const router: Router = express.Router();

// require authentication for all order routes
router.use(authenticateUser);

// create a new order
router.post('/', validateOrderInput, OrderController.createCustomerOrder);

// get order history for a customer
router.get('/history', OrderController.getCustomerOrderHistory);

// get a specific order
router.get('/my-orders/:orderId', OrderController.getCustomerOrder);

// cancel an order
router.put('/my-orders/:orderId/cancel', OrderController.cancelCustomerOrder);

export default router;