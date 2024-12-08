/*
    Type definitions for user related data
*/

// User Registration data
export interface UserRegistration {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface UserRole extends UserRegistration {
    id: string;
    role: string;

}

