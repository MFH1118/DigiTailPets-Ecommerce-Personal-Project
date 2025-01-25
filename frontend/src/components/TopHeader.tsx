//src/components/layout/TopHeader.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from '@/context/CartContext';
import CartSlideOver from '@/components/CartSlideOver';
import { useState } from 'react';

const TopHeader = () => {
  const { isOpen, closeCart, openCart, items, itemCount, updateQuantity, removeItem } = useCart();
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
              width={150}
              height={150}
              className="h-[150px] w-auto"
              priority
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl px-2">
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
              className="md:hidden"
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
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-5 w-5" />
                    Account
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchVisible && (
          <div className="md:hidden pt-4">
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