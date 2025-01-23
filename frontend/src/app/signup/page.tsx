// src/app/signup/page.tsx

import SignupForm from "@/components/auth/SignupForm";

export default function SignUpPage() {

    return (
        <div suppressHydrationWarning>
            <SignupForm />
        </div>
    );
}