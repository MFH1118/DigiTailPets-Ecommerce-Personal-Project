import { Request, Response, NextFunction } from 'express';
import { SessionModel } from '../model/session.model.js';
import { ErrorResponse} from '../types/user.types.js';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies.sessionToken;

        if (!sessionToken) {
            const errorResponse: ErrorResponse = {
                error: "Authentication required"
            };

            return res.status(401).json(errorResponse);
        }

        const session = await SessionModel.validateSession(sessionToken);

        if (!session) {
            const errorResponse: ErrorResponse = {
                error: "Invalid or expired session token"
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