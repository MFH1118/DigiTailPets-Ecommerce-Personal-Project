// src/model/session.model.ts
import prisma from '../db/prisma.js';
import { randomBytes } from 'crypto';
import { Session } from '../types/session.types.js';
import { SessionType, SessionTypeDetector } from '../utils/session-type.utils.js';
import { Request } from 'express';

export class SessionModel {

    // Generate secure session token
    private static generateSessionToken(): string {
        return randomBytes(32).toString('hex');
    }

    // Generate secure refresh token
    private static generateRefreshToken(): string {
        return randomBytes(32).toString('hex');
    }

    static async createSession(userId: string, req: Request): Promise<Session> {
        const sessionType = SessionTypeDetector.detectSessionType(req);
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
                session_type: sessionType,
                session_refresh_token: session.refreshToken,
                session_creation_time: session.creationTime,
                session_last_accessed: session.lastAccessed
            }
        } catch (error: any) {
            throw new Error(`Failed to create session: ${(error as Error).message}`);
        }
    }

    static async updateSession(sessionId: string, newType: SessionType): Promise<Session> {
        try {
            const updateSession = await prisma.session.update({
                where: { id: sessionId },
                data: { type: newType }
            });

            return {
                session_id: updateSession.id,
                user_id: updateSession.userId,
                session_token: updateSession.token,
                session_expiry: updateSession.expiry,
                session_type: newType,
                session_refresh_token: updateSession.refreshToken,
                session_creation_time: updateSession.creationTime,
                session_last_accessed: updateSession.lastAccessed
            }
            
        } catch (error: any) {
            throw new Error(`Failed to update session: ${(error as Error).message}`);
            
        }
    }
}