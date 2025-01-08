// src/model/category.model.ts

import prisma from '../db/prisma.js';
import { Category, CategoryRequest, CategoryFilterOptions, CategoryWithProductCount } from '../types/category.types.js';
import { Prisma } from '@prisma/client';

export class CategoryModel {

    // create new category
    static async createCategory(categoryData: CategoryRequest): Promise<Category> {
        try {
            const category = await prisma.category.create({
                data: {
                    name: categoryData.name,
                    description: categoryData.description,
                    isActive: categoryData.isActive ?? true
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    isActive: true
                }
            });

            return {
                categoryId: category.id,
                name: category.name,
                description: category.description ?? undefined,
                isActive: category.isActive
            };

        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('A category with this name already exists');
                }
            }
            throw new Error(`Error creating category: ${error.message}`);
        }
    }

    // get category by id
    static async getCategoryById(categoryId: string): Promise<Category | null> {
        try {
            const category = await prisma.category.findUnique({
                where: { id: categoryId },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    isActive: true
                }
            });

            if (!category){
                return null;
            }

            return {
                categoryId: category.id,
                name: category.name,
                description: category.description ?? undefined,
                isActive: category.isActive
            };

        } catch (error: any) {
            throw new Error(`Error fetching category: ${error.message}`);
        }
    }

    // Get categories with filtering and pagination
    static async getCategories(options: CategoryFilterOptions): Promise<{categories: Category[], total: number}> {
        try {
            const {
                searchTerm,
                isActive,
                sortBy = 'name',
                sortOrder = 'asc',
                page = 1,
                limit = 10
            } = options;

            const where: Prisma.CategoryWhereInput = {
                AND: [
                    isActive !== undefined ? { isActive } : {},
                    searchTerm ? {
                        OR: [
                            { name: { contains: searchTerm, mode: 'insensitive' } },
                            { description: { contains: searchTerm, mode: 'insensitive' } }
                        ]
                    } : {}
                ]
            };

            const total = await prisma.category.count({ where });

            const categories = await prisma.category.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    isActive: true
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit
            });

            return {
                categories: categories.map(category => ({
                    categoryId: category.id,
                    name: category.name,
                    description: category.description ?? undefined,
                    isActive: category.isActive
                })),
                total
            };

        } catch (error: any) {
            throw new Error(`Error fetching categories: ${error.message}`);
        }
    }

    // get categories with product count
    static async getCategoriesWithProductCount(): Promise<CategoryWithProductCount[]> {
        try {
            const categories = await prisma.category.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    isActive: true,
                    _count: {
                        select: { products: true }
                    }
                }
            });

            return categories.map(category => ({
                categoryId: category.id,
                name: category.name,
                description: category.description ?? undefined,
                isActive: category.isActive,
                productCount: category._count.products
            }));

        } catch (error: any) {
            throw new Error(`Error fetching categories with product count: ${error.message}`);
        }
    }

    // update category
    static async updateCategory(categoryId: string, categoryData: Partial<CategoryRequest>): Promise<Category> {
        try {
            const category = await prisma.category.update({
                where: { id: categoryId },
                data: categoryData,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    isActive: true
                }
            });

            return {
                categoryId: category.id,
                name: category.name,
                description: category.description ?? undefined,
                isActive: category.isActive
            };

        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('A category with this name already exists');
                }
            }
            throw new Error(`Error updating category: ${error.message}`);
        }
    }

     // delete category (soft delete)
     static async deleteCategory(categoryId: string): Promise<void> {
        try {
            
            const productsCount = await prisma.product.count({
                where: {
                    categoryId,
                    isActive: true
                }
            });

            if (productsCount > 0) {
                throw new Error('Cannot delete category with active products');
            }

            await prisma.category.update({
                where: { id: categoryId },
                data: { isActive: false }
            });

        } catch (error: any) {
            throw new Error(`Error deleting category: ${error.message}`);
        }
    }

    // check if category exists and is active
    static async isValidCategory(categoryId: string): Promise<boolean> {
        try {
            const category = await prisma.category.findFirst({
                where: {
                    id: categoryId,
                    isActive: true
                }
            });

            return !!category;

        } catch (error: any) {
            throw new Error(`Error validating category: ${error.message}`);
        }
    }

}