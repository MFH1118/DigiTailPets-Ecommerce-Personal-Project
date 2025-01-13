// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { SessionModel } from '../model/session.model.js';
import { ErrorResponse} from '../types/user.types.js';
import { AddressModel } from '../model/address.model.js';
import prisma from '../db/prisma.js';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies.sessionToken;

        if (!sessionToken) {
            const errorResponse: ErrorResponse = {
                error: "Authentication required",
                details: "Session token not provided"
            };

            return res.status(401).json(errorResponse);
        }

        const session = await SessionModel.validateSession(sessionToken);

        if (!session) {
            const errorResponse: ErrorResponse = {
                error: "Invalid or expired session token",
                details: "Please login again"
            };

            return res.status(401).json(errorResponse);
        }

        req.user = {
            userId: session.user_id
        };

        next();
        
    } catch (error: any) {
        const errorResponse: ErrorResponse = {
            error: "Error authenticating user",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        };

        return res.status(500).json(errorResponse);
        
    }
};

export const validateAddressOwnership = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        const addressId = req.params.addressId;

        // extract and verify address of the user
        const address = await AddressModel.getAddressById(addressId);

        if (!address) {
            const errorResponse: ErrorResponse = {
                error: "Invalid address",
                details: "Address not found"
            };

            return res.status(404).json(errorResponse);
        }

        if (address.userId !== userId) {
            const errorResponse: ErrorResponse = {
                error: "Unauthorized",
                details: "User does not own the address"
            };

            return res.status(403).json(errorResponse);
        }

        next();
        
    } catch (error: any) {
        const errorResponse: ErrorResponse = {
            error: "Error validating address ownership",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        };

        return res.status(500).json(errorResponse);
        
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            const errorResponse: ErrorResponse = {
                error: "Authentication required",
                details: "User ID not found"
            };
            return res.status(401).json(errorResponse);
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: true
            }
        });

        if (!user || user.role.name !== 'ADMIN') {
            const errorResponse: ErrorResponse = {
                error: "Unauthorized",
                details: "Admin access required"
            };
            return res.status(403).json(errorResponse);
        }

        next();
        
    } catch (error: any) {
        const errorResponse: ErrorResponse = {
            error: "Error checking admin status",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        };
        return res.status(500).json(errorResponse);
    }
};