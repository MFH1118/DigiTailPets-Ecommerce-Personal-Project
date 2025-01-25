// src/components/CartSlideOver.tsx

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import type { Product } from '@/data/products';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface CartItem extends Product {
  quantity: number;
}

interface CartSlideoverProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartSlideover = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity,
  onRemoveItem 
}: CartSlideoverProps) => {
  
  const { subtotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
        <SheetHeader className="px-4 py-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Your Bag</SheetTitle>
          </div>
        </SheetHeader>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-4">
          {/* Cart Items */}
          {items.length > 0 ? (
            <div className="py-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center py-4 gap-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <SheetClose asChild>
                      <Link href={`/product/${item.id}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                    </SheetClose>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium">
                      <h3>{item.name}</h3>
                      <p className="ml-4">${item.price.toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-sm font-medium"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Your bag is empty</p>
            </div>
          )}
        </div>

        {/* Footer - Always visible at bottom */}
        <div className="border-t mt-auto">
          <div className="px-4 py-6">
            <div className="flex justify-between text-base font-medium">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Tax included and shipping calculated at checkout
            </p>
            <SheetClose asChild>
              <Link href="/checkout" passHref>
                <Button className="w-full mt-6" size="lg">
                  CHECKOUT
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
                <Link href="/cart" className="block mt-4 text-center text-sm text-gray-600 hover:text-gray-900">
                  View Cart
                </Link>
              </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSlideover;