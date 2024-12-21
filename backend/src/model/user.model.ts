// src/model/user.model.ts

import { PrismaClient } from '@prisma/client';
import { User, Authentication, UserRegistrationRequest } from '../types/user.types.js';

const prisma = new PrismaClient();

export class UserModel {
  // Create new user with authentication
  static async createUser(userData: UserRegistrationRequest, hashedPassword: string): Promise<User> {
    try {
      // Use transaction to ensure both user and authentication are created
      const result = await prisma.$transaction(async (tx) => {
        // Create CUSTOMER role first
        const customerRole = await tx.role.findUniqueOrThrow({
          where: {
            name: 'CUSTOMER'
          }
        });
        // Create user
        const user = await tx.user.create({
          data: {
            username: userData.userName,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            dateOfBirth: new Date(userData.dob),
            roleId: customerRole.id, // Default role ID for customer - you might want to make this configurable
            authentication: {
              create: {
                passwordHash: hashedPassword,
                passwordReset: null,
                loginAttempts: 0,
                lockoutEndTime: null
              }
            }
          },
          include: {
            authentication: true,
            role: true
          }
        });

        // Transform to match our User interface
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
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          authentication: true
        }
      })

      if (!user) {
        return null;
      }

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
      
    } catch (error: any) {
      throw new Error(`Error finding user: ${(error as Error).message}`);
      
    }
  }
  // find user by username
  static async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          authentication: true
        }
      });

      if (!user) {
        return null;
      }

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
      }
    } catch (error:any) {
      throw new Error(`Error finding user: ${(error as Error).message}`);
    }
  }

  // Get authentication details by userId
  static async getAuthentication(userId: string): Promise<Authentication | null> {
    try {
      const auth = await prisma.authentication.findUnique({
        where: { userId }
      });

      if (!auth) {
        return null;
      }

      return {
        authId: auth.id,
        userId: auth.userId,
        authPasswordHash: auth.passwordHash,
        authPasswordReset: !!auth.passwordReset,
        authLoginAttempts: auth.loginAttempts,
        authLockoutEndTime: auth.lockoutEndTime

      }
      
    } catch (error: any) {
      throw new Error(`Error getting authentication: ${(error as Error).message}`);
    }
  }
}