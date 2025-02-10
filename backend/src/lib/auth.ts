// backend/src/lib/auth.ts

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI } from 'better-auth/plugins';
import { prisma } from '../db/prisma.js';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    appName: "DigitailPets",
    plugins: [
        openAPI(),
    ],
    emailAndPassword: {
        enabled: true,
        autoSignIn: false
    },
    user: {
        deleteUser: {
            enabled: true
        }
    },
    trustedOrigins: [
        "http://localhost:3000",
        "https://localhost:5000",
        "https://localhost:5000/api/auth"
    ]
});