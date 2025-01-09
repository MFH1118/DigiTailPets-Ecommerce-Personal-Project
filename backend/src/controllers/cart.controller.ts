// src/controllers/cart.controller.ts

import { Request, Response } from 'express';
import { CartModel } from '../model/cart.model.js';
import { CartItemRequest, ErrorResponse } from '../types/cart.types.js';

export class CartController {

    // get user current cart or create a new one
    static async getCart(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            
            const cart = await CartModel.getOrCreateCart(userId);

            return res.status(200).json({
                message: 'Cart retrieved successfully',
                cart
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error retrieving cart',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // add new item to cart
    static async addItemToCart(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const itemData: CartItemRequest = req.body;

            // Validate quantity
            if (!itemData.quantity || itemData.quantity <= 0) {
                const errorResponse: ErrorResponse = {
                    error: 'Invalid quantity',
                    details: 'Quantity must be greater than 0'
                };
                return res.status(400).json(errorResponse);
            }

            // Add item to cart
            const cartItem = await CartModel.addItem(userId, itemData);

            return res.status(201).json({
                message: 'Item added to cart successfully',
                cartItem
            });
            
        } catch (error: any) {
            // Handle specific error cases
            if (error.message.includes('Product not found') || 
                error.message.includes('not active')) {
                const errorResponse: ErrorResponse = {
                    error: 'Invalid product',
                    details: error.message
                };
                return res.status(404).json(errorResponse);
            }

            if (error.message.includes('Insufficient stock')) {
                const errorResponse: ErrorResponse = {
                    error: 'Insufficient stock',
                    details: error.message
                };
                return res.status(400).json(errorResponse);
            }

            const errorResponse: ErrorResponse = {
                error: 'Error adding item to cart',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // update item quantity in cart
    static async updateCartItemQuantity(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const cartItemId = req.params.cartItemId;
            const { quantity } = req.body;

            // Validate quantity
            if (!quantity || quantity < 0) {
                const errorResponse: ErrorResponse = {
                    error: 'Invalid quantity',
                    details: 'Quantity must be 0 or greater'
                };
                return res.status(400).json(errorResponse);
            }

            // If quantity is 0, remove the item
            if (quantity === 0) {
                await CartModel.removeItem(userId, cartItemId);
                return res.status(200).json({
                    message: 'Item removed from cart successfully'
                });
            }

            // Update item quantity
            const updatedItem = await CartModel.updateItemQuantity(userId, cartItemId, quantity);

            return res.status(200).json({
                message: 'Cart item quantity updated successfully',
                cartItem: updatedItem
            });
            
        } catch (error: any) {
            if (error.message.includes('Cart item not found')) {
                const errorResponse: ErrorResponse = {
                    error: 'Cart item not found',
                    details: 'The specified item does not exist in your cart'
                };
                return res.status(404).json(errorResponse);
            }

            if (error.message.includes('Insufficient stock')) {
                const errorResponse: ErrorResponse = {
                    error: 'Insufficient stock',
                    details: error.message
                };
                return res.status(400).json(errorResponse);
            }

            const errorResponse: ErrorResponse = {
                error: 'Error updating cart item',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // remove item from cart
    static async removeCartItem(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const cartItemId = req.params.cartItemId;

            await CartModel.removeItem(userId, cartItemId);

            return res.status(200).json({
                message: 'Item removed from cart successfully'
            });
            
        } catch (error: any) {
            if (error.message.includes('Cart item not found')) {
                const errorResponse: ErrorResponse = {
                    error: 'Cart item not found',
                    details: 'The specified item does not exist in your cart'
                };
                return res.status(404).json(errorResponse);
            }

            const errorResponse: ErrorResponse = {
                error: 'Error removing cart item',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // get summary of cart (total price, total items)
    static async getCartSummary(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            
            const summary = await CartModel.getCartSummary(userId);

            return res.status(200).json({
                message: 'Cart summary retrieved successfully',
                summary
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error retrieving cart summary',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // validate cart items
    static async validateCart(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            
            const isValid = await CartModel.validateCartItems(userId);

            if (!isValid) {
                const errorResponse: ErrorResponse = {
                    error: 'Invalid cart',
                    details: 'Some items in your cart are no longer available or have insufficient stock'
                };
                return res.status(400).json(errorResponse);
            }

            return res.status(200).json({
                message: 'Cart is valid',
                isValid: true
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error validating cart',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }
}