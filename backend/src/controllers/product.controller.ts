// src/controllers/product.controller.ts

import { Request, Response } from 'express';
import { ProductModel } from '../model/product.model.js';
import { ProductRequest, ErrorResponse } from '../types/product.types.js';
import { CategoryModel } from '../model/category.model.js';

export class ProductController {

    // get products with filtering
    static async getProducts(req: Request, res: Response): Promise<Response> {
        try {

            if (Object.keys(req.query).length === 0) {
                const result = await ProductModel.getProducts({});
                return res.status(200).json(result);
            }

            const { categoryId, minPrice, maxPrice, isActive, searchTerm, sortBy, sortOrder, page, limit } = req.query;

            const result = await ProductModel.getProducts({
                categoryId: categoryId as string,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                isActive: isActive === 'true',
                searchTerm: searchTerm as string,
                sortBy: sortBy as any,
                sortOrder: sortOrder as 'asc' | 'desc',
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined
            });

            return res.status(200).json({
                products: result.products,
                total: result.total,
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10
            });

        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching products',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }

            return res.status(500).json(errorResponse);
            
        }
    }

    // get product by ID
    static async getProductById(req: Request, res: Response): Promise<Response> {
        try {
            const productId = req.params.productId;
            const product = await ProductModel.getProductById(productId);

            if (!product) {
                const errorResponse: ErrorResponse = {
                    error: 'Product not found'
                };
                return res.status(404).json(errorResponse);
            }

            return res.status(200).json({ product });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error fetching product',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }
}