// src/admin/index.ts

import express, { Router } from 'express';
import orderRoutes from './routes/order.routes.js';

const router: Router = express.Router();

router.use('/orders', orderRoutes);

export default router;