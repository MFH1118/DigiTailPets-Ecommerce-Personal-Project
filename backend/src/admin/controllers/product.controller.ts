// src/admin/controllers/product.controller.ts

import { Request, Response } from 'express';
import { ProductModel } from '../../model/product.model.js';
import { ProductRequest, ErrorResponse } from '../../types/product.types.js';
import { CategoryModel } from '../../model/category.model.js';

export class AdminProductController {

    // create new product
    static async createProduct(req: Request, res: Response) {
        try {

            const productData: ProductRequest = req.body;

            console.log(productData);

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