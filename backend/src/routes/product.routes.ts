// src/routes/product.routes.ts
import express, { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router: Router = express.Router();

// require authentication for all routes
router.use(authenticateUser);



// get all products
router.get('/', ProductController.getProducts);

// get single product
router.get('/:productId', ProductController.getProductById);



export default router;
