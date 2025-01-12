// src/routes/wishlist.routes.ts

import express, { Router } from 'express';
import { WishListController } from '../controllers/wishlist.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router: Router = express.Router();

// require authentication for all routes
router.use(authenticateUser);

// get wishlist
router.get('/', WishListController.getWishList);

// add item to wishlist
router.post('/items/:productId', WishListController.addWishListItem);

// remove item from wishlist
router.delete('/items/:productId', WishListController.removeWishListItem);

// clear wishlist
router.delete('/clear', WishListController.clearWishList);

// check if product is in wishlist
router.get('/items/:productId/check', WishListController.checkProductInWishList);

export default router;
