import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const navigationLinks = [
    { name: 'Offers', href: '/offers' },
    { name: 'Shop By Pets', href: '/shop-by-pets' },
    { name: 'Shop By Brand', href: '/shop-by-brand' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
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
            <Button variant="ghost" size="icon" className="ml-2">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;