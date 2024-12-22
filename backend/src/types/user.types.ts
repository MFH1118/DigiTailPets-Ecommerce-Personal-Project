// src/types/user.types.ts

// Cache related types
export interface CacheOptions {
    stdTTL: number;  // Standard Time To Live in seconds
}

export interface CacheContent {
    [key: string]: User | Authentication | string | null;
}

// User Registration data
export interface User {
    userId: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    dob: Date;
    dateCreated: Date;
    lastLogin: Date | null;
    isActive: boolean;
}

// User Authentication data
export interface Authentication {
    authId: string;
    userId: string;
    authPasswordHash: string;
    authPasswordReset: boolean;
    authLoginAttempts: number;
    authLockoutEndTime: Date | null;
}

// User Role data
export interface Role {
    roleId: string;
    roleName: string;
    roleDescription: string;
}

// Cache key types for type safety
export enum CacheKeys {
    CUSTOMER_ROLE = 'customer_role_id',
    USER_EMAIL = 'user:email:',
    USER_USERNAME = 'user:username:',
    USER_AUTH = 'auth:'
}

// User Registration Client Request
export interface UserRegistrationRequest {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    dob: string;
    password: string;
}

// User Registration Server Response
export interface UserRegistrationResponse {
    user: Omit<User, 'last_login'>
    message: string;
}

// Error Response Type
export interface ErrorResponse {
    error: string;
    details?: string;
}

// Database Select Types for Prisma
export interface UserSelect {
    id: true;
    username: true;
    email: true;
    firstName: true;
    lastName: true;
    dateOfBirth: true;
    dateCreated: true;
    lastLogin: true;
    isActive: true;
}

export interface AuthenticationSelect {
    id: true;
    userId: true;
    passwordHash: true;
    passwordReset: true;
    loginAttempts: true;
    lockoutEndTime: true;
}

// Cache Result Types
export type CachedUser = User | null;
export type CachedAuth = Authentication | null;
export type CachedRoleId = string | null;

// Type for cache invalidation keys
export interface CacheInvalidationKeys {
    email: string;
    userName: string;
    userId: string;
}