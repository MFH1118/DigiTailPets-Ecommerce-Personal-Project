// src/components/CheckoutPage.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import { checkoutSchema } from '@/schemas/checkout';
import type { CheckoutFormValues } from '@/types/checkout';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CheckoutBreadcrumb from '@/components/CheckoutBreadcrumb';
import Link from 'next/link';

const CheckoutPage = () => {
  const {
    paymentProvider,
    setPaymentProvider,
    applyDiscountCode,
    discountCode,
    calculateTotal,
    processPayment,
    isProcessing
  } = useCheckout();

  const { items, subtotal } = useCart();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      country: '',
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    await processPayment();
    console.log('Form data:', data);
  };

  const total = calculateTotal(subtotal);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <CheckoutBreadcrumb currentStep="checkout" />
      {/* Checkout Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Express Checkout Options */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Express checkout</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setPaymentProvider('google-pay')}
                disabled={isProcessing}
              >
                <Image
                  src="/google-pay-icon.svg"
                  alt="Google Pay"
                  width={60}
                  height={25}
                  className="h-auto"
                />
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setPaymentProvider('paypal')}
                disabled={isProcessing}
              >
                <Image
                  src="/paypal-icon.svg"
                  alt="PayPal"
                  width={60}
                  height={25}
                  className="h-auto"
                />
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Contact</h2>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Delivery Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Delivery</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Apartment, suite, etc. (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-6 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ny">New York</SelectItem>
                            <SelectItem value="ca">California</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Input placeholder="ZIP code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Shipping Method */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Shipping Method</h2>
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <p>Standard Delivery (2-5 days)</p>
                  </div>
                  <p className="font-semibold">FREE</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Payment</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="credit-card"
                      name="payment-method"
                      checked={paymentProvider === 'credit-card'}
                      onChange={() => setPaymentProvider('credit-card')}
                      className="form-radio"
                    />
                    <label htmlFor="credit-card" className="flex items-center space-x-2">
                      <span>Credit Card</span>
                      <div className="flex space-x-2">
                        <Image src="/visa-icon.svg" alt="Visa" width={30} height={20} className="h-auto" />
                        <Image src="/mastercard-icon.svg" alt="Mastercard" width={30} height={20} className="h-auto" />
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="paypal"
                      name="payment-method"
                      checked={paymentProvider === 'paypal'}
                      onChange={() => setPaymentProvider('paypal')}
                      className="form-radio"
                    />
                    <label htmlFor="paypal" className="flex items-center space-x-2">
                      <span>PayPal</span>
                      <Image src="/paypal-icon.svg" alt="PayPal" width={60} height={25} className="h-auto" />
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-20">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                      <div className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        {item.quantity}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}

              {/* Discount Code */}
              <div className="flex space-x-2">
                <Input 
                  placeholder="Discount Code" 
                  value={discountCode}
                  onChange={(e) => applyDiscountCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">Apply</Button>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>FREE</p>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
                {/*Payment Button*/}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
                {/* Go Back Cart Button */}
<<<<<<< HEAD
                <Link href="/cart" className="block mt-4">
                  <Button variant="link" className='w-full text text-center text-sm text-gray-600 hover:text-gray-900'>
                    Return to Cart
                  </Button>
=======
                <Link href="/cart" className="block mt-4 text-center text-sm text-gray-600 hover:text-gray-900">
                  <Button variant="ghost" className='w-full text'>Return to Cart</Button>
>>>>>>> 2a08be5632bd427f40f75af5d3bba38ebf8f2481
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;