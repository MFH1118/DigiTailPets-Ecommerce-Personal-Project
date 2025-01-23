"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleGoogleSignup = () => {
    // Handle Google OAuth
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md bg-gray-100">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Create a DigiTail Pet Account</CardTitle>
          <p className="text-sm text-gray-600">Join DigiTailPets!</p>
          <p className="text-sm text-gray-600">Your Pet's Needs, Just a Click Away!</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full bg-white"
            onClick={handleGoogleSignup}
          >
            <img 
              src="/google-icon.svg" 
              alt="Google" 
              className="w-5 h-5 mr-2"
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="First Name*"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            
            <Input
              placeholder="Last Name*"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
            
            <Input
              placeholder="Mobile Number*"
              type="tel"
              required
              value={formData.mobileNumber}
              onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
            />
            
            <Input
              placeholder="Email Address*"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            
            <div className="relative">
              <Input
                placeholder="Password*"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800">
              Continue
            </Button>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/signin" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
            </p>
            <p className="text-gray-600 mt-2 text-xs">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms & Conditions
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              {' '}on how we manage your account and your personal data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;