// src/types/auth.ts
import { z } from 'zod';
import { signupSchema } from '@/schemas/auth';

export type SignupFormValues = z.infer<typeof signupSchema>;

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}