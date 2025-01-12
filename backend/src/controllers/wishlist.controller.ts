// src/controllers/wishlist.controller.ts

import { Request, Response } from 'express';
import { WishListModel } from '../model/wishlist.model.js';
import { ErrorResponse } from '../types/wishlist.types.js';

export class WishListController {
    // get user's wishlist
    static async getWishList(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const wishList = await WishListModel.getOrCreateWishList(userId);

            return res.status(200).json({
                wishList
            });
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching wishlist',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // add item to wishlist
    static async addWishListItem(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const productId = req.params.productId;

            const newItem = await WishListModel.addItem(userId, productId);

            return res.status(201).json({
                message: 'Item added to wishlist successfully',
                item: newItem
            });
        } catch (error: any) {
            if (error.message.includes('Item already exists')) {
                return res.status(400).json({
                    error: 'Item already in wishlist',
                    details: error.message
                });
            }

            if (error.message.includes('Product not found') || error.message.includes('inactive')) {
                return res.status(404).json({
                    error: 'Invalid product',
                    details: error.message
                });
            }

            const errorResponse: ErrorResponse = {
                error: 'Error adding item to wishlist',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // remove item from wishlist
    static async removeWishListItem(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const productId = req.params.productId;

            await WishListModel.removeItem(userId, productId);

            return res.status(200).json({
                message: 'Item removed from wishlist successfully'
            });
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error removing item from wishlist',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // clear wishlist
    static async clearWishList(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            await WishListModel.clearWishList(userId);

            return res.status(200).json({
                message: 'Wishlist cleared successfully'
            });
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error clearing wishlist',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // check if product in wishlist
    static async checkProductInWishList(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;
            const productId = req.params.productId;

            const isInWishList = await WishListModel.isProductInWishList(userId, productId);

            return res.status(200).json({
                isInWishList
            });
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error checking product in wishlist',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }
}