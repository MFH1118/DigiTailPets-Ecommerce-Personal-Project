import prisma from '../db/prisma.js';
import { randomBytes } from 'crypto';
import { Session } from '../types/session.types.js';

export class SessionModel {

    // Generate secure session token
    private static generateSessionToken(): string {
        return randomBytes(32).toString('hex');
    }

    // Generate secure refresh token
    private static generateRefreshToken(): string {
        return randomBytes(32).toString('hex');
    }

    static async createSession(userId: string, sessionType: 'web' | 'mobile' | 'api'): Promise<Session> {
        const sessionToken = this.generateSessionToken();
        const refreshToken = this.generateRefreshToken();
        const expiryTIme = new Date(Date.now() + 3600000); // 1 hour from now
        
        try {
            const session = await prisma.session.create({
                data: {
                    userId: userId,
                    token: sessionToken,
                    expiry: expiryTIme,
                    type: sessionType,
                    refreshToken: refreshToken,
                    creationTime: new Date(),
                    lastAccessed: new Date()
                } 
            });
            // TODO: user express-useragent or ua-parser-js to get user agent details for session_type later
            return {
                session_id: session.id,
                user_id: session.userId,
                session_token: session.token,
                session_expiry: session.expiry,
                session_type: session.type,
                session_refresh_token: session.refreshToken,
                session_creation_time: session.creationTime,
                session_last_accessed: session.lastAccessed
            }
        } catch (error: any) {
            throw new Error(`Failed to create session: ${(error as Error).message}`);
        }

        try {
            
        }
    } 
}