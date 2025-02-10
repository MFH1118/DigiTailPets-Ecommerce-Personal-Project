//src/components/layout/TopHeader.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  LogIn,
  LogOut,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import CartSlideOver from "@/components/CartSlideOver";
import { navigationLinks } from "@/components/NavigationHeader";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const TopHeader = () => {
  const {
    isOpen,
    closeCart,
    openCart,
    items,
    itemCount,
    updateQuantity,
    removeItem,
  } = useCart();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast({
              title: "Sign out success",
              description: "You have successfully signed out.",
            });
            router.push("/");
          },
          onError: (ctx) => {
            toast({
              title: "Sign out failed",
              description:
                ctx.error.message || "An error occurred while signing out.",
              variant: "destructive",
            });
          },
        },
      });
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  const renderAuthContent = () => {
    if (isPending) {
      return null;
    }

    return session ? (
      <>
        <DropdownMenuItem className="cursor-pointer">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Orders
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </DropdownMenuItem>
      </>
    ) : (
      <>
        <Link href="/signin">
          <DropdownMenuItem className="cursor-pointer">
            Sign In
          </DropdownMenuItem>
        </Link>
        <Link href="/signup">
          <DropdownMenuItem className="cursor-pointer">
            Sign Up
          </DropdownMenuItem>
        </Link>
      </>
    );
  };

  return (
    <div className="border-b bg-background">
      <div className="px-4 py-4 mx-auto max-w-[1220px]">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/digitails-logo.svg"
              alt="DigiTailPets Logo"
              width={100}
              height={100}
              className="h-[100px] w-auto"
              priority
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden sm:block flex-1 max-w-full px-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for a Product..."
                className="pl-10 pr-4 h-10"
              />
              <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              className="relative"
            >
              <ShoppingCart className="h-12 w-12" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-xs text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  {renderAuthContent()}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="border-b pb-4">
                    {!isPending && (
                      session ? (
                        <>
                          <Link href="/profile">
                            <SheetClose asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                              >
                                <User className="mr-2 h-5 w-5" />
                                Profile
                              </Button>
                            </SheetClose>
                          </Link>
                          <Link href="/orders">
                            <SheetClose asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                              >
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                Orders
                              </Button>
                            </SheetClose>
                          </Link>
                          <SheetClose asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={handleSignOut}
                            >
                              <LogOut className="mr-2 h-5 w-5" />
                              Sign Out
                            </Button>
                          </SheetClose>
                        </>
                      ) : (
                        <>
                          <Link href="/signin">
                            <SheetClose asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                              >
                                <LogIn className="mr-2 h-5 w-5" />
                                Sign In
                              </Button>
                            </SheetClose>
                          </Link>
                          <Link href="/signup">
                            <SheetClose asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                              >
                                <UserPlus className="mr-2 h-5 w-5" />
                                Sign Up
                              </Button>
                            </SheetClose>
                          </Link>
                        </>
                      )
                    )}
                  </div>
                  {/* Navigation Links */}
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchVisible && (
          <div className="sm:hidden pt-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for a Product..."
                className="pl-10 pr-4 h-10 w-full"
              />
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      <CartSlideOver
        isOpen={isOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
};

export default TopHeader;