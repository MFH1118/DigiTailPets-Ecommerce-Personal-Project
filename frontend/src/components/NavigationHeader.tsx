//src/components/layout/NavigationHeader.tsx
"use client";

import Link from 'next/link';
import { cn } from "@/lib/utils";

const navigationLinks = [
  { name: 'Offers', href: '/offers' },
  { name: 'Shop By Pets', href: '/shop-by-pets' },
  { name: 'Shop By Brand', href: '/shop-by-brand' },
  { name: 'Blog', href: '/blog' },
];

const NavigationHeader = () => {
  return (
    <div className="border-b bg-background hidden md:block">
      <div className="px-4">
        <nav className="flex justify-center">
          {navigationLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "px-5 py-4 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                "transition-colors duration-200"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavigationHeader;