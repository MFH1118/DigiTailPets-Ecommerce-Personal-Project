// src/types/wishlist.types.ts
import { Decimal } from '@prisma/client/runtime/library';

export interface WishList {
    wishListId: string;
    userId: string;
    dateCreated: Date;
    lastUpdated: Date;
    items?: WishListItem[];
}

export interface WishListItem {
    wishListItemId: string;
    wishListId: string;
    productId: string;
    dateAdded: Date;
    product?: {
        name: string;
        price: Decimal;
        imageUrl?: string;
    };
}

// Request types
export interface WishListRequest {
    userId: string;
}

export interface WishListItemRequest {
    productId: string;
}

// Response types
export interface WishListResponse {
    message: string;
    wishList: WishList;
}

export interface WishListItemResponse {
    message: string;
    item: WishListItem;
}

export interface WishListsResponse {
    wishLists: WishList[];
    total: number;
}

// Filter and pagination options
export interface WishListFilterOptions {
    userId?: string;
    sortBy?: 'dateCreated' | 'lastUpdated';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

// Error response
export interface ErrorResponse {
    error: string;
    details?: string;
}

// Prisma select types
export interface WishListSelect {
    id: true;
    dateCreated: true;
    lastUpdated: true;
    userId: true;
    items?: {
        select: {
            id: true;
            dateAdded: true;
            productId: true;
            product?: {
                select: {
                    name: true;
                    price: true;
                    imageUrl: true;
                }
            }
        }
    }
}

export interface WishListItemSelect {
    id: true;
    dateAdded: true;
    wishListId: true;
    productId: true;
    product?: {
        select: {
            name: true;
            price: true;
            imageUrl: true;
        }
    }
}