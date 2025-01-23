//src/components/HomeContent.tsx

import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';

// Placeholder product data
const products = {
  featured: Array(5).fill(null).map((_, i) => ({
    id: `featured-${i}`,
    name: `Featured Product ${i + 1}`,
    price: Math.floor(Math.random() * 50) + 30,
    image: `/api/placeholder/200/200`
  })),
  newReleases: Array(5).fill(null).map((_, i) => ({
    id: `new-${i}`,
    name: `New Product ${i + 1}`,
    price: Math.floor(Math.random() * 40) + 20,
    image: `/api/placeholder/200/200`
  })),
  essentials: Array(5).fill(null).map((_, i) => ({
    id: `essential-${i}`,
    name: `Essential Product ${i + 1}`,
    price: Math.floor(Math.random() * 30) + 10,
    image: `/api/placeholder/200/200`
  }))
};

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => (
  <Card className="w-full max-w-[280px] mx-auto transition-all hover:shadow-lg">
    <CardContent className="p-3 sm:p-4">
      <div className="aspect-square relative mb-2 sm:mb-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <h3 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">{product.name}</h3>
      <p className="text-sm sm:text-base font-bold">${product.price.toFixed(2)}</p>
    </CardContent>
    <CardFooter className="p-3 sm:p-4 pt-0">
      <Button className="w-full" variant="outline">
        Add to Cart
      </Button>
    </CardFooter>
  </Card>
);

interface ProductSectionProps {
  title: string;
  products: Product[];
}

const ProductSection = ({ title, products }: ProductSectionProps) => (
  <section className="mb-8 sm:mb-10 md:mb-12">
    <h2 className="text-2xl font-semibold mb-6">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:grid-cols-2 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </section>
);

const HomeContent = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-4 sm:py-6 md:py-8">
      {/* Sales Advertisement Banner */}
      <div className="w-full h-64 bg-gray-100 mb-12 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800">Sales Advert</h1>
        </div>
      </div>

      {/* Product Sections */}
      <ProductSection title="Featured" products={products.featured} />
      <ProductSection title="New Releases" products={products.newReleases} />
      <ProductSection title="Essentials" products={products.essentials} />
    </div>
  );
};

export default HomeContent;