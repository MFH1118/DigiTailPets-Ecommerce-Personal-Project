// src/controllers/category.controller.ts
import { Request, Response } from 'express';
import { CategoryModel } from '../model/category.model.js';
import { CategoryRequest, ErrorResponse } from '../types/category.types.js';

export class CategoryController {

    // create new category
    static async createCategory(req: Request, res: Response) {
        try {
            const categoryData: CategoryRequest = req.body;

            const newCategory = await CategoryModel.createCategory(categoryData);

            return res.status(201).json({
                message: 'Category created successfully',
                category: newCategory
            })
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error creating category',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }

            return res.status(500).json(errorResponse);
            
        }
    }

    // get categories with filtering
    static async getCategories(req: Request, res: Response): Promise<Response> {
        try {
            const {
                searchTerm,
                isActive,
                sortBy,
                sortOrder,
                page,
                limit
            } = req.query;

            const result = await CategoryModel.getCategories({
                searchTerm: searchTerm as string,
                isActive: isActive === 'true',
                sortBy: sortBy as any,
                sortOrder: sortOrder as 'asc' | 'desc',
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined
            });

            return res.status(200).json({
                categories: result.categories,
                total: result.total,
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching categories',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // get category by ID
    static async getCategoryById(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId = req.params.categoryId;
            const category = await CategoryModel.getCategoryById(categoryId);

            if (!category) {
                const errorResponse: ErrorResponse = {
                    error: 'Category not found'
                };
                return res.status(404).json(errorResponse);
            }

            return res.status(200).json({ category });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching category',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // get categories with product count
    static async getCategoriesWithProductCount(req: Request, res: Response): Promise<Response> {
        try {
            const categories = await CategoryModel.getCategoriesWithProductCount();

            return res.status(200).json({ categories });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching categories with product count',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // update category
    static async updateCategory(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId = req.params.categoryId;
            const categoryData: Partial<CategoryRequest> = req.body;

            const updatedCategory = await CategoryModel.updateCategory(categoryId, categoryData);

            return res.status(200).json({
                message: 'Category updated successfully',
                category: updatedCategory
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error updating category',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // delete category
    static async deleteCategory(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId = req.params.categoryId;
            await CategoryModel.deleteCategory(categoryId);

            return res.status(200).json({
                message: 'Category deleted successfully'
            });
            
        } catch (error: any) {
            // Check for specific error about active products
            if (error.message.includes('active products')) {
                const errorResponse: ErrorResponse = {
                    error: 'Cannot delete category',
                    details: 'Category has active products associated with it'
                };
                return res.status(400).json(errorResponse);
            }

            const errorResponse: ErrorResponse = {
                error: 'Error deleting category',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // toggle category status
    static async toggleCategoryStatus(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId = req.params.categoryId;
            const { isActive } = req.body;

            if (typeof isActive !== 'boolean') {
                const errorResponse: ErrorResponse = {
                    error: 'Invalid status value',
                    details: 'Status must be a boolean'
                };
                return res.status(400).json(errorResponse);
            }

            const updatedCategory = await CategoryModel.updateCategory(categoryId, { isActive });

            return res.status(200).json({
                message: `Category ${isActive ? 'activated' : 'deactivated'} successfully`,
                category: updatedCategory
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error updating category status',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }
}