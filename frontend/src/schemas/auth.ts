// src/schemas/auth.ts

import * as z from 'zod';

export const signupSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[A-Za-z\s]+$/, 'First name must contain only letters and spaces'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[A-Za-z\s]+$/, 'Last name must contain only letters and spaces'),
  email: z.string()
    .email('Invalid email format'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
});

export const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});