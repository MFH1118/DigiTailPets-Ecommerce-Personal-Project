// src/model/cart.model.ts

import prisma from '../db/prisma.js';
import { Cart, CartItem, CartItemRequest, CartSummary } from '../types/cart.types.js';
import { Prisma } from '@prisma/client';

export class CartModel {

    // get cart or create cart of user
    static async getOrCreateCart(userId: string): Promise<Cart> {
        try {
            let cart = await prisma.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    price: true,
                                    stockQuantity: true,
                                    isActive: true
                                }
                            }
                        }
                    }
                }
            });

            // if cart does not exist, create a new cart
            if (!cart) {
                cart = await prisma.cart.create({
                    data: { userId },
                    include: {
                        items: {
                            include: {
                                product: {
                                    select: {
                                        name: true,
                                        price: true,
                                        stockQuantity: true,
                                        isActive: true
                                    }
                                }
                            }
                        }
                    }
                });
            }

            return {
                cartId: cart.id,
                userId: cart.userId,
                creationDate: cart.creationDate,
                lastUpdate: cart.lastUpdate,
                items: cart.items.map(item => ({
                    cartItemId: item.id,
                    cartId: item.cartId,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.subtotal
                }))
            };

        } catch (error: any) {
            throw new Error(`Error getting/creating cart: ${error.message}`);
        }
    }

    // add item to cart or update quantity
    static async addItem(userId: string, itemData: CartItemRequest): Promise<CartItem> {
        try {

            return await prisma.$transaction(async (tx) => {

                // get or create cart
                const cart = await this.getOrCreateCart(userId);

                // get product details and validate
                const product = await tx.product.findFirst({
                    where: {
                        id: itemData.productId,
                        isActive: true
                    }
                });

                if (!product) {
                    throw new Error('Product not found or is not active');
                }

                // check if product is already in cart
                const existingItem = await tx.cartItem.findFirst({
                    where: {
                        cartId: cart.cartId,
                        productId: itemData.productId
                    }
                });

                // calculate total requested quantity
                const totalQuantity = existingItem 
                    ? existingItem.quantity + itemData.quantity 
                    : itemData.quantity;

                // validate stock availability
                if (product.stockQuantity < totalQuantity) {
                    throw new Error(`Insufficient stock. Available: ${product.stockQuantity}`);
                }

                // calculate prices
                const subtotal = new Prisma.Decimal(product.price.toString())
                    .mul(new Prisma.Decimal(totalQuantity.toString()));


                let cartItem;

                if (existingItem) {
                    // update existing cart item
                    cartItem = await tx.cartItem.update({
                        where: { id: existingItem.id },
                        data: {
                            quantity: totalQuantity,
                            subtotal: subtotal
                        }
                    });
                } else {
                    // create new cart item
                    cartItem = await tx.cartItem.create({
                        data: {
                            cartId: cart.cartId,
                            productId: itemData.productId,
                            quantity: itemData.quantity,
                            unitPrice: product.price,
                            subtotal: subtotal
                        }
                    });
                }

                // update cart last update timestamp
                await tx.cart.update({
                    where: { id: cart.cartId },
                    data: { lastUpdate: new Date() }
                });

                return {
                    cartItemId: cartItem.id,
                    cartId: cartItem.cartId,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    unitPrice: cartItem.unitPrice,
                    subtotal: cartItem.subtotal
                };
            });

        } catch (error: any) {
            throw new Error(`Error adding item to cart: ${error.message}`);
        }
    }

    // update item quantity in cart
    static async updateItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<CartItem> {
        try {

            return await prisma.$transaction(async (tx) => {
                // get cart and validate ownership
                const cart = await this.getOrCreateCart(userId);

                // get cart item and validate
                const cartItem = await tx.cartItem.findFirst({
                    where: {
                        id: cartItemId,
                        cartId: cart.cartId
                    },
                    include: {
                        product: true
                    }
                });

                if (!cartItem) {
                    throw new Error('Cart item not found');
                }

                // validate stock availability
                if (cartItem.product.stockQuantity < quantity) {
                    throw new Error(`Insufficient stock. Available: ${cartItem.product.stockQuantity}`);
                }

                // calculate new subtotal
                const subtotal = new Prisma.Decimal(cartItem.unitPrice.toString())
                    .mul(new Prisma.Decimal(quantity.toString()));

                // update cart item
                const updatedItem = await tx.cartItem.update({
                    where: { id: cartItemId },
                    data: {
                        quantity,
                        subtotal
                    }
                });

                // update cart last update timestamp
                await tx.cart.update({
                    where: { id: cart.cartId },
                    data: { lastUpdate: new Date() }
                });

                return {
                    cartItemId: updatedItem.id,
                    cartId: updatedItem.cartId,
                    productId: updatedItem.productId,
                    quantity: updatedItem.quantity,
                    unitPrice: updatedItem.unitPrice,
                    subtotal: updatedItem.subtotal
                };
            });

        } catch (error: any) {
            throw new Error(`Error updating cart item quantity: ${error.message}`);
        }
    }

    // remove item from cart
    static async removeItem(userId: string, cartItemId: string): Promise<void> {
        try {
            // get cart and validate ownership
            const cart = await this.getOrCreateCart(userId);

            // verify item exists and belongs to user's cart
            const cartItem = await prisma.cartItem.findFirst({
                where: {
                    id: cartItemId,
                    cartId: cart.cartId
                }
            });

            if (!cartItem) {
                throw new Error('Cart item not found');
            }

            // delete cart item
            await prisma.cartItem.delete({
                where: { id: cartItemId }
            });

            // update cart last update timestamp
            await prisma.cart.update({
                where: { id: cart.cartId },
                data: { lastUpdate: new Date() }
            });

        } catch (error: any) {
            throw new Error(`Error removing item from cart: ${error.message}`);
        }
    }

    // get cart summary (total items and subtotal)
    static async getCartSummary(userId: string): Promise<CartSummary> {
        try {
            const cart = await this.getOrCreateCart(userId);

            const cartItems = await prisma.cartItem.findMany({
                where: { cartId: cart.cartId }
            });

            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = cartItems.reduce(
                (sum, item) => sum.add(item.subtotal),
                new Prisma.Decimal(0)
            );

            return {
                totalItems,
                subtotal
            };

        } catch (error: any) {
            throw new Error(`Error calculating cart summary: ${error.message}`);
        }
    }

    // validate cart items
    static async validateCartItems(userId: string): Promise<boolean> {
        try {
            const cart = await this.getOrCreateCart(userId);

            const cartItems = await prisma.cartItem.findMany({
                where: { cartId: cart.cartId },
                include: { product: true }
            });

            // Check each item for validity
            for (const item of cartItems) {
                if (!item.product.isActive) {
                    return false;
                }
                if (item.product.stockQuantity < item.quantity) {
                    return false;
                }
            }

            return true;

        } catch (error: any) {
            throw new Error(`Error validating cart items: ${error.message}`);
        }
    }
}