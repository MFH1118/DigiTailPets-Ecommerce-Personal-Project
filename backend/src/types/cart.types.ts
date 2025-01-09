// src/types/cart.types.ts

import { Decimal } from '@prisma/client/runtime/library';

export interface Cart {
    cartId: string;
    userId: string;
    creationDate: Date;
    lastUpdate: Date;
    items?: CartItem[];
}

export interface CartItem {
    cartItemId: string;
    cartId: string;
    productId: string;
    quantity: number;
    unitPrice: Decimal;
    subtotal: Decimal;
}

export interface CartItemRequest {
    productId: string;
    quantity: number;
}

export interface CartResponse {
    message: string;
    cart: Cart;
}

export interface CartItemResponse {
    message: string;
    cartItem: CartItem;
}

export interface ErrorResponse {
    error: string;
    details?: string;
}

export interface CartSummary {
    totalItems: number;
    subtotal: Decimal;
}