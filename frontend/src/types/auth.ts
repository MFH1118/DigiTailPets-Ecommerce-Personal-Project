// src/types/auth.ts
import { z } from 'zod';
import { signupSchema, signinSchema} from '@/schemas/auth';

export type SignupFormValues = z.infer<typeof signupSchema>;
export type SigninFormValues = z.infer<typeof signinSchema>;

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}