// src/components/ProductDetail.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const { addItem } = useCart();

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-8">
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-gray-900">
              {product.category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square">
            <Image
              src={product.images[currentImage]}
              alt={`${product.name} - Image ${currentImage + 1}`}
              fill
              className="object-cover rounded-lg"
              priority={currentImage === 0}
              loading={currentImage === 0 ? "eager" : "lazy"}
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white/90 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white/90 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`flex-shrink-0 relative w-20 h-20 rounded-md overflow-hidden
                    ${currentImage === idx 
                      ? "ring-2 ring-black" 
                      : "hover:ring-2 hover:ring-gray-300"
                    }`}
                >
                  <Image
                    src={src}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    width={80}
                    height={80}
                    className="object-cover rounded-md"
                    loading="lazy"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500">{product.brand}</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4].map((n) => (
                <Star
                  key={n}
                  className="h-5 w-5 fill-current text-yellow-400"
                />
              ))}
              <StarHalf className="h-5 w-5 fill-current text-yellow-400" />
            </div>
            <span className="text-gray-600">{product.rating}</span>
          </div>

          <div className="space-y-4">
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Stock: {product.stock} units</p>
              {product.stock < 10 && product.stock > 0 && (
                <p className="text-sm text-red-600">Low stock - Order soon</p>
              )}
              {product.stock === 0 && (
                <p className="text-sm text-red-600">Out of stock</p>
              )}
            </div>
          </div>

          <Button 
            className="w-full h-12 text-lg" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
          </Button>

          <div className="pt-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="features">
              <AccordionTrigger>Product Features</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Feature 1</li>
                  <li>Feature 2</li>
                  <li>Feature 3</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="specifications">
              <AccordionTrigger>Specifications</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Brand</span>
                    <span>{product.brand}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Category</span>
                    <span>{product.category}</span>
                  </div>
                  {/* Add more specifications as needed */}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping Information</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Standard Delivery (2-5 business days)</p>
                  <p>Express Delivery (1-2 business days)</p>
                  <p className="text-sm text-gray-600">
                    * Delivery times are estimates and may vary by location
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="returns">
              <AccordionTrigger>Returns & Warranty</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>30-day return policy</p>
                  <p>1-year manufacturer warranty</p>
                  <p className="text-sm text-gray-600">
                    * Conditions apply. See our returns policy for details
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;