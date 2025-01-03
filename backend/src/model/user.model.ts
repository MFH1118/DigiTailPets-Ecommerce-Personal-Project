// src/model/user.model.ts

import prisma from '../db/prisma.js';
import { User, Authentication, UserRegistrationRequest, CacheKeys, CachedUser, CachedAuth, CachedRoleId } from '../types/user.types.js';
import NodeCache from 'node-cache';
import { comparePassword } from '../utils/auth.utils.js';

export const userCache = new NodeCache({ stdTTL: 600});



export class UserModel {

    // Helper method to get cached customer role ID
    private static async getCustomerRoleId(): Promise<string> {
        const cachedRoleId = userCache.get<CachedRoleId>(CacheKeys.CUSTOMER_ROLE);
        
        if (cachedRoleId) {
            return cachedRoleId;
        }

        const role = await prisma.role.findUniqueOrThrow({
            where: { name: 'CUSTOMER' },
            select: { id: true }
        });

        userCache.set(CacheKeys.CUSTOMER_ROLE, role.id);
        return role.id;
    }

    private static async invalidateUserCache(userId: string): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                username: true
            }
        })

        if (user) {
            this.invalidateCache(user.email, user.username, userId);
        }
    }

    // Method to invalidate user cache
    static invalidateCache(email: string, userName: string, userId: string): void {
        userCache.del(`${CacheKeys.USER_EMAIL}${email}`);
        userCache.del(`${CacheKeys.USER_USERNAME}${userName}`);
        userCache.del(`${CacheKeys.USER_AUTH}${userId}`);
    }

    static async createUser(userData: UserRegistrationRequest, hashedPassword: string): Promise<User> {
      try {
          // Get customer role ID from cache
          const customerRoleId = await this.getCustomerRoleId();

          const result = await prisma.$transaction(async (tx) => {
              const user = await tx.user.create({
                  data: {
                      username: userData.userName,
                      email: userData.email,
                      firstName: userData.firstName,
                      lastName: userData.lastName,
                      dateOfBirth: new Date(userData.dob),
                      roleId: customerRoleId,
                      authentication: {
                          create: {
                              passwordHash: hashedPassword,
                              loginAttempts: 0
                          }
                      },
                      isActive: false
                  },
                  select: {
                      id: true,
                      username: true,
                      email: true,
                      firstName: true,
                      lastName: true,
                      dateOfBirth: true,
                      dateCreated: true,
                      lastLogin: true,
                      isActive: true
                  }
              });

              return {
                  userId: user.id,
                  userName: user.username,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  dob: user.dateOfBirth,
                  dateCreated: user.dateCreated,
                  lastLogin: user.lastLogin,
                  isActive: user.isActive
              };
          });

          return result;

      } catch (error: any) {
          throw new Error(`Error creating user: ${(error as Error).message}`);
      }
   }

    //Find user by email
    static async findByEmail(email: string): Promise<User | null> {
        try {
            const cacheKey = `${CacheKeys.USER_EMAIL}${email}`;
            const cachedUser = userCache.get<CachedUser>(cacheKey);
            
            if (cachedUser) {
                return cachedUser;
            }

            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    dateOfBirth: true,
                    dateCreated: true,
                    lastLogin: true,
                    isActive: true
                }
            });

            if (!user) {
                return null;
            }

            const userResult = {
                userId: user.id,
                userName: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                dob: user.dateOfBirth,
                dateCreated: user.dateCreated,
                lastLogin: user.lastLogin,
                isActive: user.isActive
            };

            userCache.set(cacheKey, userResult);
            return userResult;
            
        } catch (error: any) {
            throw new Error(`Error finding user: ${(error as Error).message}`);
        }
    }
    // find user by username
    static async findByUserName(username: string): Promise<User | null> {
        try {
            const cacheKey = `${CacheKeys.USER_USERNAME}${username}`;
            const cachedUser = userCache.get<CachedUser>(cacheKey);
            
            if (cachedUser) {
                return cachedUser;
            }

            const user = await prisma.user.findUnique({
                where: { username },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    dateOfBirth: true,
                    dateCreated: true,
                    lastLogin: true,
                    isActive: true
                }
            });

            if (!user) {
                return null;
            }

            const userResult = {
                userId: user.id,
                userName: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                dob: user.dateOfBirth,
                dateCreated: user.dateCreated,
                lastLogin: user.lastLogin,
                isActive: user.isActive
            };

            userCache.set(cacheKey, userResult);
            return userResult;

        } catch (error: any) {
            throw new Error(`Error finding user: ${(error as Error).message}`);
        }
    }

    // Verify user password
    static async verifyPassword(userId: string, password: string): Promise<boolean> {
        try {
            const auth = await this.getAuthentication(userId);
            if (!auth) {
                return false;
            }

            const passwordMatch = comparePassword(password, auth.authPasswordHash);
            return passwordMatch;
            
        } catch (error: any) {
            throw new Error(`Error verifying password: ${(error as Error).message}`);
            
        }
    }

    // Get authentication details by userId
    static async getAuthentication(userId: string): Promise<Authentication | null> {
        try {
            const cacheKey = `${CacheKeys.USER_AUTH}${userId}`;
            const cachedAuth = userCache.get<CachedAuth>(cacheKey);
            
            if (cachedAuth) {
                return cachedAuth;
            }

            const auth = await prisma.authentication.findUnique({
                where: { userId }
            });

            if (!auth) {
                return null;
            }

            const authResult = {
                authId: auth.id,
                userId: auth.userId,
                authPasswordHash: auth.passwordHash,
                authPasswordReset: !!auth.passwordReset,
                authLoginAttempts: auth.loginAttempts,
                authLockoutEndTime: auth.lockoutEndTime
            };

            userCache.set(cacheKey, authResult);
            return authResult;
            
        } catch (error: any) {
            throw new Error(`Error getting authentication: ${(error as Error).message}`);
        }
    }

    // Update user activity login in and out
    static async updateUserActivity(userId: string, activeStatus: boolean): Promise<void> {
        try {
            await prisma.user.update({
                where: { id: userId },
                data: { 
                    lastLogin: new Date(),
                    isActive: activeStatus 
                }
            });

            this.invalidateUserCache(userId);

        } catch (error: any) {
            throw new Error(`Error updating user activity: ${(error as Error).message}`);
            
        }
    }

    static async handleFailedLogin(userId: string): Promise<void> {
        try {
            const MAX_LOGIN_ATTEMPTS = 5;
            const LOCKOUT_DURATION = 1 * 60 * 1000; // 15 minutes. 1 minute for testing

            const auth = await prisma.authentication.update({
                where: { userId },
                data: {
                    loginAttempts: {
                        increment: 1
                    }
                }
            });

            // check max attempts reached and lockout user
            if (auth.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                await prisma.authentication.update({
                    where: { userId },
                    data: {
                        lockoutEndTime: new Date(Date.now() + LOCKOUT_DURATION)
                    }
                });
            }

            this.invalidateUserCache(userId);
            
        } catch (error: any) {
            throw new Error(`Error handling failed login: ${(error as Error).message}`);
            
        }
    }

    static async resetLoginAttempts(userId: string): Promise<void> {
        try {
            await prisma.authentication.update({
                where: { userId },
                data: {
                    loginAttempts: 0,
                    lockoutEndTime: null
                }
            });

            this.invalidateUserCache(userId);
            
        } catch (error: any) {
            throw new Error(`Error resetting login attempts: ${(error as Error).message}`);
            
        }
    }

    static async isAccountLocked(userId: string): Promise<boolean> {
        try {
            const auth = await this.getAuthentication(userId);
            if (!auth) {
                return false;
            }

            const lockOutEndTime = auth.authLockoutEndTime;
            if (!lockOutEndTime) {
                return false;
            }

            if (new Date() > new Date(lockOutEndTime)) {
                await this.resetLoginAttempts(userId);
                return false;
            }

            return true;
            
        } catch (error: any) {
            throw new Error(`Error checking account lock: ${(error as Error).message}`);
            
        }
    }
}