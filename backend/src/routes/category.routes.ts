// src/routes/category.routes.ts

import express, { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router: Router = express.Router();

// require authentication for all routes
router.use(authenticateUser);

// get all categories
router.get('/', CategoryController.getCategories);

// get single category
router.get('/:categoryId', CategoryController.getCategoryById);

export default router;