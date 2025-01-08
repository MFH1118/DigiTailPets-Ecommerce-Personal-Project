// src/middleware/validate.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { UserRegistrationRequest, ErrorResponse } from '../types/user.types.js';
import { AddressRequest } from '../types/address.types.js';
import { ProductRequest } from '../types/product.types.js';
import { CategoryRequest } from '../types/category.types.js';

export const validateRegistrationInput = async (req: Request, res: Response, next: NextFunction) => {
    const { userName, email, firstName, lastName, dob, password }: UserRegistrationRequest = req.body;

    // Check input validation
    if (!userName || !email || !firstName || !lastName || !dob || !password) {
        const errorResponse: ErrorResponse = {
            error: 'Missing required fields',
            details: 'All field are required for registration'
        };
        return res.status(400).json(errorResponse);
    }

    // validated email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        const errorResponse: ErrorResponse = {
            error: 'Invalid email format'
        };

        return res.status(400).json(errorResponse);
    }

    // validate password strength
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)){
        const errorResponse: ErrorResponse = {
            error: 'Password does not meet requirements',
            details: 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character'
        };

        return res.status(400).json(errorResponse);
    }

    // Validate date of birth
    const dobDate = new Date(dob);
    const today = new Date();
    const minAge = 18;
    const maxAge = 120;

    const age = today.getFullYear() - dobDate.getFullYear();
    if (age < minAge || age > maxAge || isNaN(dobDate.getTime())) {
        const errorResponse: ErrorResponse = {
            error: 'Invalid date of birth',
            details: 'User must be between 18 and 120 years old'
        };

        return res.status(400).json(errorResponse);
    }

    next();
};

export const validateAddressInput = async (req: Request, res: Response, next: NextFunction) => {
    const { street1, city, state, postalCode, country, addressType }: AddressRequest = req.body;

    // check for missing fields
    if (!street1 || !city || !state || !postalCode || !country || !addressType) {
        const errorResponse: ErrorResponse = {
            error: 'Missing required fields',
            details: 'All fields are required for address creation'
        };

        return res.status(400).json(errorResponse);
    }

    // check if street, city, state, and country are valid strings
    if (typeof street1 !== 'string' || typeof city !== 'string' || typeof state !== 'string' || typeof country !== 'string') {
        const errorResponse: ErrorResponse = {
            error: 'Invalid field types',
            details: 'Street, city, state, and country must be strings'
        };

        return res.status(400).json(errorResponse);
    }

    // check if postal code is a valid string and is numerical
    if (typeof postalCode !== 'string' || isNaN(Number(postalCode))) {
        const errorResponse: ErrorResponse = {
            error: 'Invalid postal code',
            details: 'Postal code must be a string of numbers'
        };

        return res.status(400).json(errorResponse);
    }

    // check if address type is valid
    if (addressType !== 'SHIPPING' && addressType !== 'BILLING') {
        const errorResponse: ErrorResponse = {
            error: 'Invalid address type',
            details: 'Address type must be either SHIPPING or BILLING'
        };

        return res.status(400).json(errorResponse); 
    }

    next();

}

export const validateProductInput = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, stockQuantity, sku, categoryId }: ProductRequest = req.body;

    // check required fields
    if (!name || !price || stockQuantity === undefined || !sku || !categoryId) {
        const errorResponse: ErrorResponse = {
            error: 'Missing required fields',
            details: 'Name, price, stock quantity, SKU, and category ID are required'
        };
        return res.status(400).json(errorResponse);
    }

    // validate name length
    if (name.length < 2 || name.length > 100) {
        const errorResponse: ErrorResponse = {
            error: 'Invalid name length',
            details: 'Product name must be between 2 and 100 characters'
        };
        return res.status(400).json(errorResponse);
    }

    // validate price
    if (typeof price !== 'number' || price <= 0) {
        const errorResponse: ErrorResponse = {
            error: 'Invalid price',
            details: 'Price must be a positive number'
        };
        return res.status(400).json(errorResponse);
    }

    // validate stock quantity
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
        const errorResponse: ErrorResponse = {
            error: 'Invalid stock quantity',
            details: 'Stock quantity must be a non-negative integer'
        };
        return res.status(400).json(errorResponse);
    }

    // validate SKU format (alphanumeric, uppercase, no spaces)
    const skuRegex = /^[A-Z0-9-]+$/;
    if (!skuRegex.test(sku)) {
        const errorResponse: ErrorResponse = {
            error: 'Invalid SKU format',
            details: 'SKU must contain only uppercase letters, numbers, and hyphens'
        };
        return res.status(400).json(errorResponse);
    }

    // validate description length if provided
    if (description && description.length > 1000) {
        const errorResponse: ErrorResponse = {
            error: 'Invalid description length',
            details: 'Description must not exceed 1000 characters'
        };
        return res.status(400).json(errorResponse);
    }

    next();
}

export const validateCategoryInput = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description }: CategoryRequest = req.body;

    // check required fields
    if (!name) {
        const errorResponse: ErrorResponse = {
            error: 'Missing required fields',
            details: 'Category name is required'
        };
        return res.status(400).json(errorResponse);
    }

    // validate name length
    if (name.length < 2 || name.length > 50) {
        const errorResponse: ErrorResponse = {
            error: 'Invalid name length',
            details: 'Category name must be between 2 and 50 characters'
        };
        return res.status(400).json(errorResponse);
    }

    // validate name format (alphanumeric and spaces only)
    const nameRegex = /^[a-zA-Z0-9\s-&]+$/;
    if (!nameRegex.test(name)) {
        const errorResponse: ErrorResponse = {
            error: 'Invalid name format',
            details: 'Category name can only contain letters, numbers, spaces, hyphens, and ampersands'
        };
        return res.status(400).json(errorResponse);
    }

    // validate description length if provided
    if (description && description.length > 500) {
        const errorResponse: ErrorResponse = {
            error: 'Invalid description length',
            details: 'Description must not exceed 500 characters'
        };
        return res.status(400).json(errorResponse);
    }

    next();
};