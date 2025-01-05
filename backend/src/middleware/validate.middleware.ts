// src/middleware/validate.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { UserRegistrationRequest, ErrorResponse } from '../types/user.types.js';
import { AddressRequest } from '../types/address.types.js';

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