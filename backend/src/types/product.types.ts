//src/types/product.types.ts
import { Decimal } from '@prisma/client/runtime/library';

export interface Product {
    productId: string;
    categoryId: string;
    name: string;
    description?: string;
    price: Decimal;
    stockQuantity: number;
    isActive: boolean;
    sku: string;
    imageUrl?: string;
    dateAdded: Date;
    dateModified?: Date;
}

export interface ProductRequest {
    categoryId: string;
    name: string;
    description?: string;
    price: number | string;
    stockQuantity: number;
    isActive?: boolean;
    sku: string;
    imageUrl?: string;
}

export interface ProductResponse {
    message: string;
    product: Product;
}

export interface ProductListResponse {
    products: Product[];
    total: number;
    page?: number;
    limit?: number;
}

export interface ProductSelect {
    id: true;
    categoryId: true;
    name: true;
    description: true;
    price: true;
    stockQuantity: true;
    isActive: true;
    sku: true;
    imageUrl: true;
    dateAdded: true;
    dateModified: true;
}

export interface ProductFilterOptions {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    searchTerm?: string;
    sortBy?: 'price' | 'name' | 'dateAdded';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface ErrorResponse {
    error: string;
    details?: string;
}