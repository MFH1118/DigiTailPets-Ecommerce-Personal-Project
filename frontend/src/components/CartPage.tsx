// src/components/CartPage.tsx
"use client";

import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import CheckoutBreadcrumb from '@/components/CheckoutBreadcrumb';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CartPage = () => {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <CheckoutBreadcrumb currentStep="cart" />

      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.length > 0 ? (
            <>
              {/* Table Headers */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b">
                <div className="col-span-6">
                  <h3 className="font-medium">PRODUCT</h3>
                </div>
                <div className="col-span-2 text-center">
                  <h3 className="font-medium">PRICE</h3>
                </div>
                <div className="col-span-2 text-center">
                  <h3 className="font-medium">QUANTITY</h3>
                </div>
                <div className="col-span-2 text-right">
                  <h3 className="font-medium">SUBTOTAL</h3>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mt-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b">
                    <div className="col-span-12 md:col-span-6 flex items-center space-x-4">
                      <div className="relative h-24 w-24 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-4 md:col-span-2 text-center">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="col-span-6 md:col-span-2 flex justify-center items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="col-span-2 md:col-span-2 text-right flex items-center justify-end space-x-2">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mt-8 flex space-x-4">
                <Input 
                  placeholder="Coupon code" 
                  className="max-w-xs"
                />
                <Button variant="outline">
                  Apply coupon
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
              <Link href="/">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Cart Totals */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>
                Cart Totals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <p className="text-sm font-medium">
                      ${subtotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between pb-4 border-b">
                    <span>Shipping</span>
                    <span>Calculate shipping</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pb-4">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full">
                      Proceed to checkout
                    </Button>
                  </Link>
<<<<<<< HEAD
                  <Link href="/" className="block mt-4">
                    <Button variant="link" className="w-full text-center text-sm text-gray-600 hover:text-gray-900">
=======
                  <Link href="/" className="block mt-4 text-center text-sm text-gray-600 hover:text-gray-900">
                    <Button variant="ghost" className="w-full">
>>>>>>> 2a08be5632bd427f40f75af5d3bba38ebf8f2481
                      Continue shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;