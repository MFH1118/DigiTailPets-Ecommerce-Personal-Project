// src/types/checkout.ts
import { z } from 'zod';
import { checkoutSchema } from '@/schemas/checkout';

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export type PaymentProvider = 'credit-card' | 'paypal' | 'google-pay';
export type ShippingMethod = 'standard' | 'express';

export interface DiscountInfo {
  code: string;
  amount: number;
  type: 'percentage' | 'fixed';
}

export interface CheckoutState {
  paymentProvider: PaymentProvider;
  shippingMethod: ShippingMethod;
  discountCode: string;
  appliedDiscount: DiscountInfo | null;
  shippingCost: number;
  isProcessing: boolean;
  step: CheckoutStep;
}

export type CheckoutStep = 'contact' | 'shipping' | 'payment' | 'confirmation';