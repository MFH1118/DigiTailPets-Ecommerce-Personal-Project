// src/admin/routes/product.routes.ts

import express, { Router } from 'express';
import { AdminProductController } from '../controllers/product.controller.js';
import { authenticateUser, isAdmin } from '../../middleware/auth.middleware.js';
import { validateProductInput } from '../../middleware/validate.middleware.js';

const router: Router = express.Router();

// require authentication for all routes
router.use(authenticateUser, isAdmin);

// create new product
router.post('/', validateProductInput, AdminProductController.createProduct);

// update product
router.put('/:productId', validateProductInput, AdminProductController.updateProduct);

// update stock quantity
router.patch('/:productId/stock', AdminProductController.updateStock);

// delete product
router.delete('/:productId', AdminProductController.deleteProduct);

export default router;