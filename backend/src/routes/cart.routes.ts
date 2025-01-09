// src/routes/cart.routes.ts

import express, { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateCartItemInput } from '../middleware/validate.middleware.js';

const router: Router = express.Router();

// require authentication for all routes
router.use(authenticateUser);

// get cart route
router.get('/', CartController.getCart);

// add item to cart route
router.post('/', validateCartItemInput, CartController.addItemToCart);

// update item quantity in cart route
router.put('/items/:cartItemId', validateCartItemInput, CartController.updateCartItemQuantity);

// remove item from cart route
router.delete('/items/:cartItemId', CartController.removeCartItem);

// cart total summary route
router.get('/summary', CartController.getCartSummary);

// validate cart items route
router.post('/validate', CartController.validateCart);