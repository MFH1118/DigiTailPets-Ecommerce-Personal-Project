// src/controllers/category.controller.ts

import { Request, Response } from 'express';
import { CategoryModel } from '../model/category.model.js';
import { ErrorResponse } from '../types/category.types.js';

export class CategoryController {

    // get categories with filtering
    static async getCategories(req: Request, res: Response): Promise<Response> {
        try {

            if (Object.keys(req.query).length === 0) {
                const result = await CategoryModel.getCategories({});
                return res.status(200).json(result);
            }

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

            return res.status(200).json(result);
            
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
}