// frontend/src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:5000'}/api/auth`,
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    mode: 'cors', // Add this
    fetch: {
        // Fetch-specific options
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    },
    onRequest: async (context: any) => {
        // Log requests for debugging
        console.log('Auth request:', {
            url: context.url,
            method: context.method,
            body: context.body
        });
        return context;
    },
    onError: (error: any) => {
        // Log errors for debugging
        console.error('Auth client error:', error);
    }
});