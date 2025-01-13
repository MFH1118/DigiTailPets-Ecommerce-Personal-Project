// src/types/orders.types.ts

import { Decimal } from '@prisma/client/runtime/library';

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
    CANCELLED = 'CANCELLED'
}

export interface OrderItem {
    orderItemId: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: Decimal;
    subtotal: Decimal;
    createdAt: Date;
    updatedAt: Date;
}

export interface Order {
    orderId: string;
    userId: string;
    orderDate: Date;
    orderTotal: Decimal;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    lastUpdated: Date;
    shippingId?: string;
    items?: OrderItem[];
}

export interface CreateOrderItemRequest {
    productId: string;
    quantity: number;
    unitPrice: number | string;
}

export interface CreateOrderRequest {
    userId: string;
    items: CreateOrderItemRequest[];
    shippingId?: string;
}

export interface UpdateOrderStatusRequest {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
}

export interface OrderResponse {
    message: string;
    order: Order;
}

export interface OrderItemResponse {
    message: string;
    orderItem: OrderItem;
}

export interface OrderListResponse {
    orders: Order[];
    total: number;
    page?: number;
    limit?: number;
}

export interface OrderFilterOptions {
    userId?: string;
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    startDate?: Date;
    endDate?: Date;
    minTotal?: number;
    maxTotal?: number;
    sortBy?: 'orderDate' | 'orderTotal' | 'lastUpdated';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface OrderSelect {
    id: true;
    userId: true;
    orderDate: true;
    orderTotal: true;
    orderStatus: true;
    paymentStatus: true;
    lastUpdated: true;
    shippingId: true;
    items?: {
        select: {
            id: true;
            quantity: true;
            unitPrice: true;
            subtotal: true;
            createdAt: true;
            updatedAt: true;
            productId: true;
        }
    }
}

export interface ErrorResponse {
    error: string;
    details?: string;
}

export interface OrderSummary {
    totalOrders: number;
    totalRevenue: Decimal;
    averageOrderValue: Decimal;
    ordersByStatus: {
        [key in OrderStatus]: number;
    };
}