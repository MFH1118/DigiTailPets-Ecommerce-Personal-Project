// src/routes/category.routes.ts
import express, { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateCategoryInput } from '../middleware/validate.middleware.js';

const router: Router = express.Router();

// require authentication for all routes
router.use(authenticateUser);

// create new category TODO: add authorization admin only
router.post('/', validateCategoryInput, CategoryController.createCategory);

// get all categories
router.get('/', CategoryController.getCategories);

// get categories with product count
router.get('/product-count', CategoryController.getCategoriesWithProductCount);

// get single category
router.get('/:categoryId', CategoryController.getCategoryById);

// update category TODO: add authorization admin only
router.put('/:categoryId', validateCategoryInput, CategoryController.updateCategory);

// toggle category status TODO: add authorization admin only
router.patch('/:categoryId/toggle-status', CategoryController.toggleCategoryStatus);

// delete category TODO: add authorization admin only
router.delete('/:categoryId', CategoryController.deleteCategory);

export default router;