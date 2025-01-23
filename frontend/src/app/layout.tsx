// src/app/layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Inter } from 'next/font/google';

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
        <Header />

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
