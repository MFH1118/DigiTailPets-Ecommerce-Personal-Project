// src/types/category.types.ts

export type CategorySortFields = 'name' | 'isActive';
export type SortOrder = 'asc' | 'desc';

export interface Category {
    categoryId: string;
    name: string;
    description?: string;
    isActive: boolean;
}

export interface CategoryRequest {
    name: string;
    description?: string;
    isActive?: boolean;
}

export interface CategoryResponse {
    message: string;
    category: Category;
}

export interface CategoryListResponse {
    categories: Category[];
    total: number;
    page?: number;
    limit?: number;
}

export interface CategorySelect {
    id: true;
    name: true;
    description: true;
    isActive: true;
}

export interface ErrorResponse {
    error: string;
    details?: string;
}

export interface CategoryFilterOptions {
    searchTerm?: string;
    isActive?: boolean;
    sortBy?: CategorySortFields;
    sortOrder?: SortOrder;
    page?: number;
    limit?: number;
}

export interface CategoryWithProductCount extends Category {
    productCount: number;
}

export interface CategoryTree extends Category {
    children?: CategoryTree[];
    parentId?: string;
    level?: number;
}