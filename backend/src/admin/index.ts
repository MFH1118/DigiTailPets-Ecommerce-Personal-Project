// src/admin/index.ts

import express, { Router } from 'express';
import orderRoutes from './routes/order.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';

const router: Router = express.Router();

router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);


export default router;