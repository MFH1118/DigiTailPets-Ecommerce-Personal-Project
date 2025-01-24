//src/components/HomeContent.tsx

"use client";
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Product, getFeaturedProducts, getNewReleases, getEssentials } from '@/data/products';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  return (
    <Link href={`/product/${product.id}`} passHref>
      <Card className="w-[280px] transition-all hover:shadow-lg">
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
        <Button 
            className="w-full" 
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

interface ProductSectionProps {
  title: string;
  products: Product[];
}

const ProductSection = ({ title, products }: ProductSectionProps) => (
  <section className="mb-8 sm:mb-10 md:mb-12">
    <h2 className="text-2xl font-semibold mb-6">{title}</h2>
    <div className="flex flex-wrap justify-center lg:justify-start xl:max-w-[1440px]:justify-start 2xl:justify-start gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </section>
);

const HomeContent = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-4 sm:py-6 md:py-8">
      <div className="w-full h-64 bg-gray-100 mb-12 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800">Sales Advert</h1>
        </div>
      </div>

      <ProductSection title="Featured" products={getFeaturedProducts()} />
      <ProductSection title="New Releases" products={getNewReleases()} />
      <ProductSection title="Essentials" products={getEssentials()} />
    </div>
  );
};

export default HomeContent;