// src/app/checkout/page.tsx

import { CheckoutProvider } from '@/context/CheckoutContext';
import CheckoutPage from '@/components/CheckoutPage';

export default function Checkout() {
  return (
    <CheckoutProvider>
      <CheckoutPage />
    </CheckoutProvider>
  );
}