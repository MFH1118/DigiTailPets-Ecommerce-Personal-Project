/*
    Type definitions for user related data
*/

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
    authPassowordReset: boolean;
    authLoginAttempts: number;
    authLockoutEndTime: Date | null;
}

// User Role data
export interface Role {
    roleId: string;
    roleName: string;
    roleDescription: string;
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