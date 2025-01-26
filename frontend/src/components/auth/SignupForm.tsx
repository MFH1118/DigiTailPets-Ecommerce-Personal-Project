// src/components/auth/SignupForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { signupSchema } from "@/schemas/auth";
import { SignupFormValues } from "@/types/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import Image from "next/image";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    console.log(values);
    // Handle form submission
  };

  const handleGoogleSignup = () => {
    // Handle Google OAuth
  };

  return (
    <AuthLayout
      title="Create a DigiTail Pet Account"
      subtitle="Join DigiTailPets! Your Pet's Needs, Just a Click Away!"
    >
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full bg-white flex items-center justify-center gap-2"
          onClick={handleGoogleSignup}
        >
          <Image
            src="/google-icon.svg"
            alt="Google"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          Continue with Google
        </Button>

        <div className="relative w-full my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-100 px-4 text-sm text-gray-500">OR</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First Name*" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Last Name*" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Mobile Number*" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email Address*"
                      type="email"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Password*"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
            >
              Continue
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{''}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in here
            </Link>
          </p>
          <p className="text-gray-600 mt-2 text-xs">
            By creating an account, you agree to DigiTail Pet&apos;{''}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms & Conditions
            </Link>{''}
            and{''}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>{''}
            This includes how we collect, use, and protect your personal data.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupForm;
