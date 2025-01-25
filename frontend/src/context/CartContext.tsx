// src/context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { Product } from '@/data/products';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getItems: () => CartItem[];
  subtotal: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'digitailpets_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const initialRender = useRef(true);

  // Load cart data on mount
  useEffect(() => {
    const savedItems = getStoredCart();
    if (savedItems.length > 0) {
      setItems(savedItems);
    }
  }, []);

  // Save cart data on updates, skip initial render
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product: Product) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
    openCart();
  }, [openCart]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(currentItems =>
      quantity === 0
        ? currentItems.filter(item => item.id !== productId)
        : currentItems.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const getItems = useCallback(() => items, [items]);

  const itemCount = useMemo(() => 
    items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(() => 
    items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(() => ({
    items,
    isOpen,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItems,
    itemCount,
    subtotal
  }), [items, isOpen, openCart, closeCart, addItem, updateQuantity, removeItem, clearCart, getItems, itemCount, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}