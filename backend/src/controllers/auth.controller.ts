// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { UserModel } from '../model/user.model.js';
import  { UserRegistrationRequest, ErrorResponse } from '../types/user.types.js';
import { hashPassword } from '../utils/auth.utils.js';

export class AuthController {
    static async registerUser(req: Request, res: Response): Promise<Response> {
        try {
            const registrationData: UserRegistrationRequest = req.body;
            const { email, password } = registrationData

            // check if user exists by email
            const existingUserEmail = await UserModel.findByEmail(email);
            if (existingUserEmail) {
                const errorResponse: ErrorResponse = {
                    error: 'User already exists'
                };

                return res.status(400).json(errorResponse);
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // create user with authentication
            const newUser = await UserModel.createUser(registrationData, hashedPassword);

            // return success response
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