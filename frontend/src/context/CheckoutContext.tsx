// src/context/CheckoutContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type {
  PaymentProvider,
  ShippingMethod,
  CheckoutState,
  CheckoutStep
} from '@/types/checkout';

interface CheckoutContextType extends CheckoutState {
  setPaymentProvider: (provider: PaymentProvider) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  applyDiscountCode: (code: string) => Promise<boolean>;
  removeDiscount: () => void;
  setStep: (step: CheckoutStep) => void;
  processPayment: () => Promise<void>;
  calculateTotal: (subtotal: number) => number;
  resetCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CheckoutState>({
    paymentProvider: 'credit-card',
    shippingMethod: 'standard',
    discountCode: '',
    appliedDiscount: null,
    shippingCost: 0,
    isProcessing: false,
    step: 'contact',
  });

  const setPaymentProvider = useCallback((provider: PaymentProvider) => {
    setState(prev => ({ ...prev, paymentProvider: provider }));
  }, []);

  const setShippingMethod = useCallback((method: ShippingMethod) => {
    setState(prev => ({
      ...prev,
      shippingMethod: method,
      shippingCost: method === 'standard' ? 0 : 15.99
    }));
  }, []);

  const applyDiscountCode = useCallback(async (code: string): Promise<boolean> => {
    setState(prev => ({ ...prev, discountCode: code }));
    
    // TODO: should be an API call to validate the code
    if (code === 'SAVE10') {
      setState(prev => ({
        ...prev,
        appliedDiscount: {
          code,
          amount: 10,
          type: 'percentage'
        }
      }));
      return true;
    }
    return false;
  }, []);

  const removeDiscount = useCallback(() => {
    setState(prev => ({
      ...prev,
      discountCode: '',
      appliedDiscount: null
    }));
  }, []);

  const setStep = useCallback((step: CheckoutStep) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const processPayment = useCallback(async () => {
    setState(prev => ({ ...prev, isProcessing: true }));
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, []);

  const calculateTotal = useCallback((subtotal: number): number => {
    let total = subtotal;
    
    // Apply shipping cost
    total += state.shippingCost;
    
    // Apply discount if any
    if (state.appliedDiscount) {
      if (state.appliedDiscount.type === 'percentage') {
        total *= (1 - state.appliedDiscount.amount / 100);
      } else {
        total -= state.appliedDiscount.amount;
      }
    }
    
    return Math.max(0, total);
  }, [state.appliedDiscount, state.shippingCost]);

  const resetCheckout = useCallback(() => {
    setState({
      paymentProvider: 'credit-card',
      shippingMethod: 'standard',
      discountCode: '',
      appliedDiscount: null,
      shippingCost: 0,
      isProcessing: false,
      step: 'contact',
    });
  }, []);

  const value = useMemo(() => ({
    ...state,
    setPaymentProvider,
    setShippingMethod,
    applyDiscountCode,
    removeDiscount,
    setStep,
    processPayment,
    calculateTotal,
    resetCheckout,
  }), [state, setPaymentProvider, setShippingMethod, applyDiscountCode, 
      removeDiscount, setStep, processPayment, calculateTotal, resetCheckout]);

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}