// src/components/auth/AuthLayout.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLayoutProps } from '@/types/auth';

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-gray-100">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;