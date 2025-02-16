import { createAuthMiddleware, APIError } from "better-auth/api";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })
  .superRefine((data, ctx) => {

    // Check name first
    if (!data.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required",
        path: ["name"]
      });
      return;
    }

    // Check email
    if (!data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required",
        path: ["email"]
      });
      return;
    }

    // Check password
    if(!data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required",
        path: ["password"]
      });
      return;
    }

    // Check if name contains only letters and spaces
    if (!/^[A-Za-z\s]+$/.test(data.name)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name must contain only letters and spaces",
        path: ["name"]
      });
      return;
    }

    // Check name length
    if (data.name.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name must be at least 2 characters",
        path: ["name"],
      });
      return;
    }

    // Then check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid email format",
        path: ["email"],
      });
      return;
    }

    // Finally check password
    if (!data.password || data.password.length < 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 12 characters",
        path: ["password"],
      });
      return;
    }

    // Check if password contains uppercase letter
    if (!/[A-Z]/.test(data.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain uppercase letter",
        path: ["password"],
      });
      return;
    }

    // Check if password contains lowercase letter
    if (!/[a-z]/.test(data.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain lowercase letter",
        path: ["password"],
      });
      return;
    }

    // Check if password contains number
    if (!/[0-9]/.test(data.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain number",
        path: ["password"],
      });
      return;
    }

    // Check if password contains special character
    if (!/[^A-Za-z0-9]/.test(data.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain special character",
        path: ["password"],
      });
      return;
    }
  });

export const signUpValidationHook = {
  handler: createAuthMiddleware(async (context) => {
    if (context.path === "/sign-up/email") {
      try {
        const validateData = signupSchema.parse(context.body);
        return {
          context: {
            ...context,
            body: validateData,
          },
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const catchedError = error.errors[0]?.message
          throw new APIError("BAD_REQUEST", {
            message: `${catchedError}`,
          });
        }
        throw error;
      }
    }
  })
};
