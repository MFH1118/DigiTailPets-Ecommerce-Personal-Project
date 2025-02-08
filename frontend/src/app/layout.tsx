// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DigiTailPets - Everything Pets Just a Click Away',
  description: 'Your one-stop shop for all pet needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Toaster />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}