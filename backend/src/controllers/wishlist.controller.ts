// src/controller/wishlist.controller.ts

import { Request, Response } from 'express';
import { WishListModel } from '../model/wishlist.model.js';
import { WishListRequest, WishListItemRequest, ErrorResponse } from '../types/wishlist.types.js';

export class WishListController {

    // create a new wishlist
    static async getOrCreateWishList(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;

            const newWishList = await WishListModel.getOrCreateWishList(userId);

            return res.status(201).json({
                message: 'Wishlist recieved/created successfully',
                wishList: newWishList
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error creating wishlist',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };

            return res.status(500).json(errorResponse);
            
        }
    }

    // add item to wishlist
    static async addWishListItem(req: Request, res: Response): Promise<Response> {
        try {
            const wishListId = req.params.wishListId as string;
            const { productId } = req.body as WishListItemRequest;

            if (!productId) {
                return res.status(400).json({
                    error: 'Product ID is required'
                });
            }

            const newItem = await WishListModel.addWishListItem(wishListId, productId);

            return res.status(201).json({
                message: 'Item added to wishlist successfully',
                item: newItem
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error adding item to wishlist',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };

            return res.status(500).json(errorResponse);
            
        }
    }

    // get user's wishlist
    static async getWishList(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId as string;

            const wishList = await WishListModel.getWishListByUserId(userId);

            if (!wishList) {
                return res.status(404).json({
                    error: 'Wishlist not found'
                });
            }

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

    // remove item from wishlist
    static async removeWishListItem(req: Request, res: Response): Promise<Response> {
        try {
            const wishListId = req.params.wishListId as string;
            const productId = req.params.productId as string;

            await WishListModel.removeWishListItem(wishListId, productId);

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
            const wishListId = req.params.wishListId as string;
            const userId = req.user?.userId as string;

            const wishList = await WishListModel.getWishListByUserId(userId);
            if (!wishList || wishList.wishListId !== wishListId) {
                return res.status(403).json({
                    error: 'Unauthorized access to wishlist'
                });
            }

            await WishListModel.clearWishList(wishListId);

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
            const wishListId = req.params.wishListId as string;
            const productId = req.params.productId as string;

            const isInWishList = await WishListModel.isProductInWishList(wishListId, productId);

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