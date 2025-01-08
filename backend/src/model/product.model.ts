// src/model/product.model.ts

import prisma from "../db/prisma.js";
import { Product, ProductRequest, ProductFilterOptions} from "../types/product.types.js";
import { Prisma } from '@prisma/client';

export class ProductModel {

    //create new product
    static async createProduct(productData: ProductRequest): Promise<Product> {
        try {
            const product = await prisma.product.create({
                data: {
                    name: productData.name,
                    description: productData.description,
                    price: new Prisma.Decimal(productData.price.toString()),
                    stockQuantity: productData.stockQuantity,
                    isActive: productData.isActive ?? true,
                    sku: productData.sku,
                    imageUrl: productData.imageUrl,
                    categoryId: productData.categoryId
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    stockQuantity: true,
                    isActive: true,
                    sku: true,
                    imageUrl: true,
                    dateAdded: true,
                    dateModified: true,
                    categoryId: true
                }
            });

            return {
                productId: product.id,
                name: product.name,
                description: product.description ?? undefined,
                price: product.price,
                stockQuantity: product.stockQuantity,
                isActive: product.isActive,
                sku: product.sku,
                imageUrl: product.imageUrl ?? undefined,
                dateAdded: product.dateAdded,
                dateModified: product.dateModified ?? undefined,
                categoryId: product.categoryId
            };
            
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('A product with this SKU already exists');
                }
            }
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    //get product by id
    static async getProductById(productId: string): Promise<Product | null> {
        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    stockQuantity: true,
                    isActive: true,
                    sku: true,
                    imageUrl: true,
                    dateAdded: true,
                    dateModified: true,
                    categoryId: true
                }
            });

            if (!product) return null;

            return {
                productId: product.id,
                name: product.name,
                description: product.description ?? undefined,
                price: product.price,
                stockQuantity: product.stockQuantity,
                isActive: product.isActive,
                sku: product.sku,
                imageUrl: product.imageUrl ?? undefined,
                dateAdded: product.dateAdded,
                dateModified: product.dateModified ?? undefined,
                categoryId: product.categoryId
            };

        } catch (error: any) {
            throw new Error(`Error fetching product: ${error.message}`);
        }
    }

    // get products with filtering options
    static async getProducts(options: ProductFilterOptions): Promise<{products: Product[], total: number}> {
        try {
            const {
                categoryId,
                minPrice,
                maxPrice,
                isActive,
                searchTerm,
                sortBy = 'dateAdded',
                sortOrder = 'desc',
                page = 1,
                limit = 10
            } = options;

            const where: Prisma.ProductWhereInput = {
                AND: [
                    categoryId ? { categoryId } : {},
                    isActive !== undefined ? { isActive } : {},
                    minPrice || maxPrice ? {
                        price: {
                            gte: minPrice ? new Prisma.Decimal(minPrice.toString()) : undefined,
                            lte: maxPrice ? new Prisma.Decimal(maxPrice.toString()) : undefined
                        }
                    } : {},
                    searchTerm ? {
                        OR: [
                            { name: { contains: searchTerm, mode: 'insensitive' } },
                            { description: { contains: searchTerm, mode: 'insensitive' } },
                            { sku: { contains: searchTerm, mode: 'insensitive' } }
                        ]
                    } : {}
                ]
            };

            const total = await prisma.product.count({ where });

            const products = await prisma.product.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    stockQuantity: true,
                    isActive: true,
                    sku: true,
                    imageUrl: true,
                    dateAdded: true,
                    dateModified: true,
                    categoryId: true
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit
            });

            return {
                products: products.map(product => ({
                    productId: product.id,
                    name: product.name,
                    description: product.description ?? undefined,
                    price: product.price,
                    stockQuantity: product.stockQuantity,
                    isActive: product.isActive,
                    sku: product.sku,
                    imageUrl: product.imageUrl ?? undefined,
                    dateAdded: product.dateAdded,
                    dateModified: product.dateModified ?? undefined,
                    categoryId: product.categoryId
                })),
                total
            };

        } catch (error: any) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    // update product
    static async updateProduct(productId: string, productData: Partial<ProductRequest>): Promise<Product> {
        try {
            // convert price to decimal
            const data = {
                ...productData,
                price: productData.price ? new Prisma.Decimal(productData.price.toString()) : undefined,
                dateModified: new Date()
            };

            const product = await prisma.product.update({
                where: { id: productId },
                data,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    stockQuantity: true,
                    isActive: true,
                    sku: true,
                    imageUrl: true,
                    dateAdded: true,
                    dateModified: true,
                    categoryId: true
                }
            });

            return {
                productId: product.id,
                name: product.name,
                description: product.description ?? undefined,
                price: product.price,
                stockQuantity: product.stockQuantity,
                isActive: product.isActive,
                sku: product.sku,
                imageUrl: product.imageUrl ?? undefined,
                dateAdded: product.dateAdded,
                dateModified: product.dateModified ?? undefined,
                categoryId: product.categoryId
            };

        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('A product with this SKU already exists');
                }
            }
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    // update stock quantity
    static async updateStock(productId: string, quantity: number): Promise<Product> {
        try {
            const product = await prisma.product.update({
                where: { id: productId },
                data: {
                    stockQuantity: {
                        increment: quantity
                    },
                    dateModified: new Date()
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    stockQuantity: true,
                    isActive: true,
                    sku: true,
                    imageUrl: true,
                    dateAdded: true,
                    dateModified: true,
                    categoryId: true
                }
            });

            return {
                productId: product.id,
                name: product.name,
                description: product.description ?? undefined,
                price: product.price,
                stockQuantity: product.stockQuantity,
                isActive: product.isActive,
                sku: product.sku,
                imageUrl: product.imageUrl ?? undefined,
                dateAdded: product.dateAdded,
                dateModified: product.dateModified ?? undefined,
                categoryId: product.categoryId
            };

        } catch (error: any) {
            throw new Error(`Error updating stock: ${error.message}`);
        }
    }

    // delete product (soft delete)
    static async deleteProduct(productId: string): Promise<void> {
        try {
            await prisma.product.update({
                where: { id: productId },
                data: { 
                    isActive: false,
                    dateModified: new Date()
                }
            });
        } catch (error: any) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }
}