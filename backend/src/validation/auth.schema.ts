import { z } from "zod"

const passwordSchema = z.string()
  .min(12, "Password must be at least 12 characters (from my zod schema!)")
  .regex(/[A-Z]/, "Must contain uppercase letter (from my zod schema!)")
  .regex(/[a-z]/, "Must contain lowercase letter (from my zod schema!)")
  .regex(/[0-9]/, "Must contain number (from my zod schema!)")
  .regex(/[^A-Za-z0-9]/, "Must contain special character (from my zod schema!)")



export const signUpSchema = z.object({
  email: z.string().email("Invalid email format")
    .refine(email => email.endsWith('@company.com (from my zod schema!)'), {
      message: "Must use company email"
    }),
  password: passwordSchema,
  name: z.string().min(2, "Name is required")
})