// src/components/layout/header.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, User } from 'lucide-react';

const Header = () => {
  const navigationLinks = [
    { name: 'Offers', href: '/offers' },
    { name: 'Shop By Pets', href: '/shop-by-pets' },
    { name: 'Shop By Brand', href: '/shop-by-brand' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src= {"/digitails-logo.svg"}
            alt="DigiTailPets Logo"
            width={200}
            height={50}
            className="h-auto w-30"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex md:gap-4">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search for a Product..."
              className="w-full rounded-full border border-gray-300 bg-gray-100 py-2 pl-10 pr-4 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
          </Link>
          <Link href="/account" className="relative">
            <User className="h-6 w-6 text-gray-700" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;