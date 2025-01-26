//src/components/layout/TopHeader.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import CartSlideOver from "@/components/CartSlideOver";
import { useState } from "react";
import { navigationLinks } from "@/components/NavigationHeader";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
                    <Link href="/signin">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-5 w-5" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-5 w-5" />
                        Sign Up
                      </Button>
                    </Link>
                  </div>
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
