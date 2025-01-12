// src/model/wishlist.model.ts

import prisma from '../db/prisma.js';
import { WishList, WishListItem, WishListFilterOptions } from '../types/wishlist.types.js';
import { Prisma } from '@prisma/client';

export class WishListModel {

    // get user's wishlist
    private static async getWishListByUserId(userId: string) {
        return prisma.wishList.findUnique({
            where: { userId },
            select: {
                id: true,
                userId: true,
                dateCreated: true,
                lastUpdated: true,
                items: {
                    select: {
                        id: true,
                        dateAdded: true,
                        productId: true,
                        product: {
                            select: {
                                name: true,
                                price: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            }
        });
    }

    // get or create user's wishlist
    static async getOrCreateWishList(userId: string): Promise<WishList> {
        try {
            let wishList = await this.getWishListByUserId(userId);

            if (!wishList) {
                wishList = await prisma.wishList.create({
                    data: { userId },
                    select: {
                        id: true,
                        userId: true,
                        dateCreated: true,
                        lastUpdated: true,
                        items: {
                            select: {
                                id: true,
                                dateAdded: true,
                                productId: true,
                                product: {
                                    select: {
                                        name: true,
                                        price: true,
                                        imageUrl: true
                                    }
                                }
                            }
                        }
                    }
                });
            }

            return {
                wishListId: wishList.id,
                userId: wishList.userId,
                dateCreated: wishList.dateCreated,
                lastUpdated: wishList.lastUpdated,
                items: wishList.items.map(item => ({
                    wishListItemId: item.id,
                    wishListId: wishList.id,
                    productId: item.productId,
                    dateAdded: item.dateAdded,
                    product: {
                        name: item.product.name,
                        price: item.product.price,
                        imageUrl: item.product.imageUrl ?? undefined
                    }
                }))
            };
        } catch (error: any) {
            throw new Error(`Error getting/creating wishlist: ${error.message}`);
        }
    }

    // add item to wishlist
    static async addItem(userId: string, productId: string): Promise<WishListItem> {
        try {
            const wishList = await this.getOrCreateWishList(userId);

            // check if item already exists
            const existingItem = await prisma.wishListItem.findFirst({
                where: {
                    wishListId: wishList.wishListId,
                    productId
                }
            });

            if (existingItem) {
                throw new Error('Item already exists in wishlist');
            }

            // check if product exists and is active
            const product = await prisma.product.findFirst({
                where: {
                    id: productId,
                    isActive: true
                }
            });

            if (!product) {
                throw new Error('Product not found or is inactive');
            }

            const wishListItem = await prisma.wishListItem.create({
                data: {
                    wishListId: wishList.wishListId,
                    productId
                },
                select: {
                    id: true,
                    dateAdded: true,
                    wishListId: true,
                    productId: true,
                    product: {
                        select: {
                            name: true,
                            price: true,
                            imageUrl: true
                        }
                    }
                }
            });

            // Update wishlist lastUpdated
            await prisma.wishList.update({
                where: { id: wishList.wishListId },
                data: { lastUpdated: new Date() }
            });

            return {
                wishListItemId: wishListItem.id,
                wishListId: wishListItem.wishListId,
                productId: wishListItem.productId,
                dateAdded: wishListItem.dateAdded,
                product: {
                    name: wishListItem.product.name,
                    price: wishListItem.product.price,
                    imageUrl: wishListItem.product.imageUrl ?? undefined
                }
            };
        } catch (error: any) {
            throw new Error(`Error adding item to wishlist: ${error.message}`);
        }
    }

    // remove item from wishlist
    static async removeItem(userId: string, productId: string): Promise<void> {
        try {
            const wishList = await this.getWishListByUserId(userId);
            if (!wishList) {
                throw new Error('Wishlist not found');
            }

            await prisma.wishListItem.deleteMany({
                where: {
                    wishListId: wishList.id,
                    productId
                }
            });

            // update wishlist lastUpdated
            await prisma.wishList.update({
                where: { id: wishList.id },
                data: { lastUpdated: new Date() }
            });
        } catch (error: any) {
            throw new Error(`Error removing item from wishlist: ${error.message}`);
        }
    }

    // clear wishlist
    static async clearWishList(userId: string): Promise<void> {
        try {
            const wishList = await this.getWishListByUserId(userId);
            if (!wishList) {
                throw new Error('Wishlist not found');
            }

            await prisma.wishListItem.deleteMany({
                where: { wishListId: wishList.id }
            });

            // update wishlist lastUpdated
            await prisma.wishList.update({
                where: { id: wishList.id },
                data: { lastUpdated: new Date() }
            });
        } catch (error: any) {
            throw new Error(`Error clearing wishlist: ${error.message}`);
        }
    }

    // check if product in wishlist
    static async isProductInWishList(userId: string, productId: string): Promise<boolean> {
        try {
            const wishList = await this.getWishListByUserId(userId);
            if (!wishList) {
                return false;
            }

            const item = await prisma.wishListItem.findFirst({
                where: {
                    wishListId: wishList.id,
                    productId
                }
            });

            return !!item;
        } catch (error: any) {
            throw new Error(`Error checking product in wishlist: ${error.message}`);
        }
    }
}