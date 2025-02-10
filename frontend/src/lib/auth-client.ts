// frontend/src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:5000'}/api/auth`,
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    mode: 'cors',
    fetch: {
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    },
    onRequest: async (context: any) => {
        console.log('Auth request:', {
            url: context.url,
            method: context.method,
            body: context.body
        });
        return context;
    },
    onError: (error: any) => {
        console.error('Auth client error:', error);
    }
});