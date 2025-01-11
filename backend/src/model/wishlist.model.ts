// src/model/wishlist.model.ts

import prisma from '../db/prisma.js';
import { WishList, WishListItem, WishListFilterOptions } from '../types/wishlist.types.js';
import { Prisma } from '@prisma/client';

export class WishListModel {

    // get or create a new wishlist
    static async getOrCreateWishList(userId: string): Promise<WishList> {
        try {
            // check if user already has a wishlist
            let wishList = await prisma.wishList.findUnique({
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

            if (!wishList) {
                wishList = await prisma.wishList.create({
                    data: {
                        userId
                    },
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

    // add item to wishlists
    static async addWishListItem(wishListId: string, productId: string): Promise<WishListItem> {
        try {
            // check if item already exists in wishlist
            const existingItem = await prisma.wishListItem.findFirst({
                where: {
                    wishListId,
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
                    wishListId,
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

            // update wishlist lastUpdated
            await prisma.wishList.update({
                where: { id: wishListId },
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

    // get wishlist by userId
    static async getWishListByUserId(userId: string): Promise<WishList | null> {
        try {
            const wishList = await prisma.wishList.findUnique({
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

            if (!wishList) return null;

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
            throw new Error(`Error fetching wishlist: ${error.message}`);
        }
    }

    // remove item from wishlist
    static async removeWishListItem(wishListId: string, productId: string): Promise<void> {
        try {
            await prisma.wishListItem.deleteMany({
                where: {
                    wishListId,
                    productId
                }
            });

            // update wishlist lastUpdated
            await prisma.wishList.update({
                where: { id: wishListId },
                data: { lastUpdated: new Date() }
            });

        } catch (error: any) {
            throw new Error(`Error removing item from wishlist: ${error.message}`);
        }
    }

    // clear wishlist
    static async clearWishList(wishListId: string): Promise<void> {
        try {
            await prisma.wishListItem.deleteMany({
                where: { wishListId }
            });

            // update wishlist lastUpdated
            await prisma.wishList.update({
                where: { id: wishListId },
                data: { lastUpdated: new Date() }
            });

        } catch (error: any) {
            throw new Error(`Error clearing wishlist: ${error.message}`);
        }
    }
    
    // check if product in wishlist
    static async isProductInWishList(wishListId: string, productId: string): Promise<boolean> {
        try {
            const item = await prisma.wishListItem.findFirst({
                where: {
                    wishListId,
                    productId
                }
            });

            return !!item;

        } catch (error: any) {
            throw new Error(`Error checking product in wishlist: ${error.message}`);
        }
    }
}