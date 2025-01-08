// src/routes/product.routes.ts
import express, { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateProductInput } from '../middleware/validate.middleware.js';

const router: Router = express.Router();

// require authentication for all routes
router.use(authenticateUser);

// create new product TODO: add authorization admin only
router.post('/', validateProductInput, ProductController.createProduct);

// get all products
router.get('/', ProductController.getProducts);

// get single product
router.get('/:productId', ProductController.getProductById);

// update product TODO: add authorization admin only
router.put('/:productId', validateProductInput, ProductController.updateProduct);

// update stock quantity TODO: add authorization admin only
router.patch('/:productId/stock', ProductController.updateStock);

// delete product TODO: add authorization admin only
router.delete('/:productId', ProductController.deleteProduct);

export default router;
