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

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = Array(5).fill(product.image);
  const { addItem } = useCart();

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-8">
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <a href="/" className="hover:text-gray-900">
              Home
            </a>
          </li>
          <li>/</li>
          <li>
            <a href="/category" className="hover:text-gray-900">
              Category
            </a>
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
              src={images[currentImage]}
              alt="Product"
              fill
              className="object-cover rounded-lg"
            />
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <div className="flex space-x-4 overflow-x-auto">
            {images.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`flex-shrink-0 ${currentImage === idx ? "ring-2 ring-black" : ""}`}
              >
                <Image
                  src={src}
                  alt={`Product ${idx + 1}`}
                  width={80}
                  height={80}
                  className="object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
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
          <p className="text-2xl font-bold">${product.price}</p>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Colour:</h3>
              <div className="flex space-x-2">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className="w-12 h-12 border rounded-md hover:border-black"
                  >
                    <Image
                      src="/api/placeholder/48/48"
                      alt={`Color ${n}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full h-12 text-lg" onClick={handleAddToCart}>
              ADD TO CART
            </Button>
          </div>

          <div className="pt-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="features">
              <AccordionTrigger>Additional Features</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Feature 1</li>
                  <li>Feature 2</li>
                  <li>Feature 3</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ingredients">
              <AccordionTrigger>Ingredients</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Ingredient 1</li>
                  <li>Ingredient 2</li>
                  <li>Ingredient 3</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="material">
              <AccordionTrigger>Product Material</AccordionTrigger>
              <AccordionContent>
                Product material details and specifications go here.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="measurements">
              <AccordionTrigger>Measurements</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Height: 10 inches</li>
                  <li>Width: 8 inches</li>
                  <li>Depth: 6 inches</li>
                  <li>Weight: 2 lbs</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
