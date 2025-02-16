import { createAuthMiddleware, APIError } from "better-auth/api";
import { z } from "zod";

const signinSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .superRefine((data, ctx) => {
    // Check email
    if (!data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required",
        path: ["email"],
      });
    }

    // Check password
    if (!data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required",
        path: ["password"],
      });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid email format",
        path: ["email"],
      });
      return;
    }

    // Check password length
    if (data.password.length < 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters",
        path: ["password"],
      });
    }
  });

export const signInValidationHook = {
  handler: createAuthMiddleware(async (context) => {
    if (context.path === "/sign-in/email") {
      try {
        const validateData = signinSchema.parse(context.body);
        return {
          context: {
            ...context,
            body: validateData,
          },
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const catchedError = error.errors[0]?.message;
          throw new APIError("BAD_REQUEST", {
            message: `${catchedError}`,
          });
        }
        throw error;
      }
    }
  }),
};
