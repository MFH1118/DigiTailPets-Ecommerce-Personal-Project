// src/app/signin/page.tsx

import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div suppressHydrationWarning>
            <LoginForm />
        </div>
    );
}