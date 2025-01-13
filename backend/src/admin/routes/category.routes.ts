// src/admin/routes/cateory.routes.ts

import express, { Router } from 'express';
import { AdminCategoryController } from '../controllers/category.controller.js';
import { authenticateUser, isAdmin } from '../../middleware/auth.middleware.js';
import { validateCategoryInput } from '../../middleware/validate.middleware.js';

const router: Router = express.Router();

// require authentication for all routes
router.use(authenticateUser, isAdmin);

// create new category
router.post('/', validateCategoryInput, AdminCategoryController.createCategory);

// get categories with product count
router.get('/product-count', AdminCategoryController.getCategoriesWithProductCount);

// update category
router.put('/:categoryId', validateCategoryInput, AdminCategoryController.updateCategory);

// toggle category status
router.patch('/:categoryId/toggle-status', AdminCategoryController.toggleCategoryStatus);

// delete category
router.delete('/:categoryId', AdminCategoryController.deleteCategory);

export default router;