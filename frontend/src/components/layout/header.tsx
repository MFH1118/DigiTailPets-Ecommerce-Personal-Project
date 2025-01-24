//src/components/layout/header.tsx
"use client";


import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from '@/context/CartContext';
import CartSlideOver from '@/components/CartSlideOver';

const Header = () => {
  const { isOpen, closeCart, openCart, items, itemCount, updateQuantity, removeItem } = useCart();

  const navigationLinks = [
    { name: 'Offers', href: '/offers' },
    { name: 'Shop By Pets', href: '/shop-by-pets' },
    { name: 'Shop By Brand', href: '/shop-by-brand' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <>
      <header className="w-full border-b bg-background">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-8 flex-1">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/digitails-logo.svg"
                alt="DigiTailPets Logo"
                width={200}
                height={50}
                className="h-auto w-48"
                priority
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navigationLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <Button variant="ghost" className="text-sm font-medium">
                    {link.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <div className="relative flex-1 max-w-md">
              <Input
                type="search"
                placeholder="Search for a Product..."
                className="pl-10 pr-4 h-10 w-full"
              />
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 relative"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-xs text-white flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <CartSlideOver
        isOpen={isOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </>
  );
};

export default Header;