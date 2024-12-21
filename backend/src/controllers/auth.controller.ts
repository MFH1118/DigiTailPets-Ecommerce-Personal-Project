// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { UserModel } from '../model/user.model.js';
import  { UserRegistrationRequest, ErrorResponse } from '../types/user.types.js';
import { hashPassword } from '../utils/auth.utils.js';

export class AuthController {
    static async registerUser(req: Request, res: Response): Promise<Response> {
        try {
            const registrationData: UserRegistrationRequest = req.body;
            const { userName, email, firstName, lastName, dob, password } = registrationData;

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

            // check if user exists by email
            const existingUserEmail = await UserModel.findByEmail(email);
            if (existingUserEmail) {
                const errorResponse: ErrorResponse = {
                    error: 'User already exists'
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

            // Hash password
            const hashedPassword = await hashPassword(password);

            // create user with authentication
            const newUser = await UserModel.createUser(registrationData, hashedPassword);

            // return sucess response
            return res.status(201).json({
                message: 'User created successfully',
                user: {
                    userId: newUser.userId,
                    userName: newUser.userName,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    dob: newUser.dob,
                    dateCreated: newUser.dateCreated,
                    isActive: newUser.isActive
                }
            });
        } catch (error: any) {
            console.error('Registration error:', error);
            const errorResponse: ErrorResponse = {
                error: 'Internal server error during registration',
                details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            };

            return res.status(500).json(errorResponse)
        }

    }   
}