// src/app/profile/page.tsx
import ProfilePage from "@/components/ProfilePage";

export default function Profile() {
    return (
        <div suppressHydrationWarning>
            <ProfilePage />
        </div>
    );
}