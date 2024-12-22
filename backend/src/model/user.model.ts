// src/model/user.model.ts

import prisma from '../db/prisma.js';
import { User, Authentication, UserRegistrationRequest, CacheKeys, CachedUser, CachedAuth, CachedRoleId } from '../types/user.types.js';
import NodeCache from 'node-cache';

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
                      }
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

      } catch (error) {
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
        
    } catch (error) {
        throw new Error(`Error finding user: ${(error as Error).message}`);
    }
  }
  // find user by username
  static async findByUsername(username: string): Promise<User | null> {
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

    } catch (error) {
        throw new Error(`Error finding user: ${(error as Error).message}`);
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
        
    } catch (error) {
        throw new Error(`Error getting authentication: ${(error as Error).message}`);
    }
  }

    // Method to invalidate user cache
    static invalidateUserCache(email: string, userName: string, userId: string): void {
    userCache.del(`${CacheKeys.USER_EMAIL}${email}`);
    userCache.del(`${CacheKeys.USER_USERNAME}${userName}`);
    userCache.del(`${CacheKeys.USER_AUTH}${userId}`);
  }
}