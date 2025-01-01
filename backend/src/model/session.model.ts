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

    static async createSession(userId: string, req: Request): Promise<Session> {
        const sessionType = SessionTypeDetector.detectSessionType(req);
        const sessionToken = this.generateSessionToken();
        const expiryTime = new Date(Date.now() + 3600000); // 1 hour from now
        
        try {

            // check for existing active sessions
            const existingSessions = await prisma.session.findMany({
                where: {
                    userId: userId,
                    expiry: {
                        gte: new Date()
                    }
                }
            });

            if (existingSessions.length > 0) {
                await prisma.session.updateMany({
                    where: {
                        userId: userId,
                        expiry: {
                            gt: new Date()
                        }
                    },
                    data: {
                        expiry: new Date() // Expire them now
                    }
                });
            }

            const session = await prisma.session.create({
                data: {
                    userId: userId,
                    token: sessionToken,
                    expiry: expiryTime,
                    type: sessionType,
                    creationTime: new Date(),
                    lastAccessed: new Date()
                } 
            });

            return {
                session_id: session.id,
                user_id: session.userId,
                session_token: session.token,
                session_expiry: session.expiry,
                session_type: sessionType,
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
                data: { 
                    type: newType,
                    lastAccessed: new Date()}
            });

            return {
                session_id: updateSession.id,
                user_id: updateSession.userId,
                session_token: updateSession.token,
                session_expiry: updateSession.expiry,
                session_type: newType,
                session_creation_time: updateSession.creationTime,
                session_last_accessed: updateSession.lastAccessed
            }
            
        } catch (error: any) {
            throw new Error(`Failed to update session: ${(error as Error).message}`);
            
        }
    }

    static async validateSession(token: string): Promise<Session | null> {
        try {
            const session = await prisma.session.findFirst({
                where: {
                    token,
                    expiry: {
                        gt: new Date()
                    }
                }
            });

            if (!session) {
                return null;
            }

            const updateSession = await prisma.session.update({
                where: { id: session.id },
                data: { lastAccessed: new Date() }
            });

            return {
                session_id: updateSession.id,
                user_id: updateSession.userId,
                session_token: updateSession.token,
                session_expiry: updateSession.expiry,
                session_type: updateSession.type as SessionType,
                session_creation_time: updateSession.creationTime,
                session_last_accessed: updateSession.lastAccessed
            }
            
        } catch (error: any) {
            throw new Error(`Failed to validate session: ${(error as Error).message}`);
            
        }
    }

    static async expireSession(token: string): Promise<void> {
        try {
            await prisma.session.updateMany({
                where: {
                    token: token,
                    expiry: {
                        gte: new Date()
                    }
                },
                data: {
                    expiry: new Date()
                }
            });
            
        } catch (error: any) {
            throw new Error(`Failed to expire session: ${(error as Error).message}`);
            
        }
    }
}