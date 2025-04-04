// src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SigninFormValues } from "@/types/auth";
import { signinSchema } from "@/schemas/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SigninFormValues) => {
    const { email, password } = values;

    try {
      await authClient.signIn.email({
        email,
        password
      }, {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          toast({
            title: 'Sign in success',
            description: 'You have successfully signed in.',
          });
          router.push('/');
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast({
            title: 'Sign in failed',
            description: ctx.error.message || "An error occurred while signing in.",
            variant: 'destructive'
          })
        }

      });
      
    } catch (error: any) {
      setIsLoading(false);
      console.error('Sign in error:', error);
      toast({
        title: 'Sign in failed',
        description: error.message || "An error occurred while creating your account.",
        variant: 'destructive'
      });
      
    }

  };

  const handleGoogleSignin = () => {};

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Sign in to your account to continue"
    >
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full bg-white flex items-center justify-center gap-2"
          onClick={handleGoogleSignin}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email Address*"
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

            <div className="text-left text-sm">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <LoadingButton
              type="submit"
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
              loading={isLoading}
            >
              Sign In
            </LoadingButton>
          </form>
        </Form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Dont have an account?{''}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
          <p className="text-gray-600 mt-2 text-xs">
            By signing in, you agree to our current{''}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms & Conditions
            </Link>{''}
            and{''}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>{''}
            on how we manage your account and your personal data.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
