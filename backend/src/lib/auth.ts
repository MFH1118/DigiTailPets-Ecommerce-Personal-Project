// backend/src/lib/auth.ts

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI } from 'better-auth/plugins';
import { prisma } from '../db/prisma.js';
import { createAuthMiddleware, APIError } from 'better-auth/api';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    appName: "DigitailPets",
    plugins: [
        openAPI(),
    ],
    emailAndPassword: {
        enabled: true
    },
    user: {
        deleteUser: {
            enabled: true
        }
    }
});