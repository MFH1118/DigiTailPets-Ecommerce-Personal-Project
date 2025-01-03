// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { UserModel } from '../model/user.model.js';
import  { UserRegistrationRequest, ErrorResponse } from '../types/user.types.js';
import { hashPassword } from '../utils/auth.utils.js';
import { SessionModel } from '../model/session.model.js';
import { User } from '../types/user.types.js';

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

            // check if username exists
            const existingUserName = await UserModel.findByUserName(registrationData.userName);
            if (existingUserName) {
                const errorResponse: ErrorResponse = {
                    error: 'Username already exists'
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

    static async loginUser(req: Request, res: Response): Promise<Response> {
        try {
            // get user from request
            const {email, password} = req.body;

            // verify user email
            const user = await UserModel.findByEmail(email);
            if (!user) {
                const errorResponse: ErrorResponse = {
                    error: 'Invalid email or password'
                };
                return res.status(401).json(errorResponse);
            }

            // check user account if locked
            const isLocked = await UserModel.isAccountLocked(user.userId);
            if (isLocked) {
                const errorResponse: ErrorResponse = {
                    error: 'Account is temporarily locked due to too many failed attempts. Please try again later.',
                    details: 'Please wait 15 minutes before trying again'
                };
                return res.status(401).json(errorResponse);
            }

            // verify user password
            const isValidPassword = await UserModel.verifyPassword(user.userId, password);
            if (!isValidPassword) {
                // increment login attempts
                await UserModel.handleFailedLogin(user.userId);
                
                const errorResponse: ErrorResponse = {
                    error: 'Invalid email or password'
                };
                return res.status(401).json(errorResponse);
            }

            // reset login attempts for successful login
            await UserModel.resetLoginAttempts(user.userId);

            // create session
            const session = await SessionModel.createSession(user.userId, req);

            res.cookie('sessionToken', session.session_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                domain: process.env.COOKIE_DOMAIN || undefined
            });

            // update isActive status
            await UserModel.updateUserActivity(user.userId, true);

            return res.status(200).json({
                message: 'Login successful',
                user: {
                    userId: user.userId,
                    userName: user.userName,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isActive: user.isActive
                }
            });
            
        } catch (error) {
            console.error('Login error:', error);
            const errorResponse: ErrorResponse = {
                error: 'Internal server error during login',
                details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            };
            return res.status(500).json(errorResponse);
        }
    }

    static async logoutUser(req: Request, res: Response): Promise<Response> {
        try {
            // Get session token from cookie
            const sessionToken = req.cookies.sessionToken;
            if (!sessionToken) {
                return res.status(400).json({
                    error: 'No active session'
                });
            }

            // Get session from database
            const userSession = await SessionModel.validateSession(sessionToken);

            // Expire the session in database
            await SessionModel.expireSession(sessionToken);

            // Update user activity status
            await UserModel.updateUserActivity(userSession?.user_id as string, false);

            // Clear the session cookie
            res.clearCookie('sessionToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                domain: process.env.COOKIE_DOMAIN || undefined
            });

            return res.status(200).json({
                message: 'Logout successful'
            });
            
        } catch (error: any) {
            console.error('Logout error:', error);
            const errorResponse: ErrorResponse = {
                error: 'Internal server error during logout',
                details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            };
            return res.status(500).json(errorResponse);
            
        }
    }
}