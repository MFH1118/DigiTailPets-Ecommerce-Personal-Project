// backend/src/lib/auth.ts

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI, phoneNumber } from 'better-auth/plugins';
import { prisma } from '../db/prisma.js';
import { signUpValidationHook } from '../hooks/signUp.validation.js';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    appName: "DigitailPets",
    plugins: [
        openAPI(),
        phoneNumber()
    ],
    hooks: {
        before: (context) => signUpValidationHook.handler(context)
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        minPasswordLength: 12
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