// src/components/ProfilePage.tsx

"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, User, Settings, CreditCard } from "lucide-react";

const ProfilePage = () => {
  const menuItems = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-6 py-8">
      {/* Profile Header - Only show on mobile */}
      <div className="lg:hidden mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-gray-500">john.doe@example.com</p>
            <Badge className="mt-2">Premium Member</Badge>
          </div>
        </div>
        <Separator className="my-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-3">
          {/* Profile Info - Only show on desktop */}
          <div className="hidden lg:block mb-8">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-bold">John Doe</h1>
              <p className="text-gray-500 text-sm">john.doe@example.com</p>
              <Badge className="mt-2">Premium Member</Badge>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive order updates and promotions</p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
              <Separator />

              {/* Password */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-gray-500">Last updated 3 months ago</p>
                </div>
                <Button variant="outline">Change</Button>
              </div>
              <Separator />

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
              <Separator />

              {/* Payment Methods */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Methods</p>
                    <p className="text-sm text-gray-500">Manage your payment options</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-6 w-6" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/25</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
                <Button variant="outline" className="w-full">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;