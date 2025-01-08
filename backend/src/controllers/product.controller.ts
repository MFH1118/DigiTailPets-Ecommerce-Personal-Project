// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { ProductModel } from '../model/product.model.js';
import { ProductRequest, ErrorResponse } from '../types/product.types.js';
import { CategoryModel } from '../model/category.model.js';

export class ProductController {

    // create new product
    static async createProduct(req: Request, res: Response) {
        try {

            const productData: ProductRequest = req.body;

            // validate if category exists and is active
            const isValidCategory = await CategoryModel.isValidCategory(productData.categoryId);
            
            if (!isValidCategory) {
                const errorResponse: ErrorResponse = {
                    error: 'Invalid category',
                    details: 'Category does not exist or is not active'
                };

                return res.status(400).json(errorResponse);
            }

            const newProduct = await ProductModel.createProduct(productData);

            return res.status(201).json({
                message: 'Product created successfully',
                data: newProduct
            })
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error creating product',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }

            return res.status(500).json(errorResponse);
            
        }
    }

    // get products with filtering
    static async getProducts(req: Request, res: Response): Promise<Response> {
        try {
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

    // update product
    static async updateProduct(req: Request, res: Response): Promise<Response> {
        try {
            const productId = req.params.productId;
            const productData: Partial<ProductRequest> = req.body;

            if (productData.categoryId) {
                const isValidCategory = await CategoryModel.isValidCategory(productData.categoryId);
                if (!isValidCategory) {
                    const errorResponse: ErrorResponse = {
                        error: 'Invalid category',
                        details: 'Category does not exist or is inactive'
                    };
                    return res.status(400).json(errorResponse);
                }
            }

            const updatedProduct = await ProductModel.updateProduct(productId, productData);

            return res.status(200).json({
                message: 'Product updated successfully',
                product: updatedProduct
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error updating product',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // update stock quantity
    static async updateStock(req: Request, res: Response): Promise<Response> {
        try {
            const productId = req.params.productId;
            const { quantity } = req.body;

            if (typeof quantity !== 'number') {
                const errorResponse: ErrorResponse = {
                    error: 'Invalid quantity',
                    details: 'Quantity must be a number'
                };
                return res.status(400).json(errorResponse);
            }

            const updatedProduct = await ProductModel.updateStock(productId, quantity);

            return res.status(200).json({
                message: 'Stock updated successfully',
                product: updatedProduct
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error updating stock',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    // delete product
    static async deleteProduct(req: Request, res: Response): Promise<Response> {
        try {
            const productId = req.params.productId;
            await ProductModel.deleteProduct(productId);

            return res.status(200).json({
                message: 'Product deleted successfully'
            });
            
        } catch (error: any) {
            const errorResponse: ErrorResponse = {
                error: 'Error deleting product',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }
}