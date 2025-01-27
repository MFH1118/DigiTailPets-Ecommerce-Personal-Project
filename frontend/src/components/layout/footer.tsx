//src/components/layout/footer.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const customerService = [
    { name: 'FAQs', href: '/faqs' },
    { name: 'Track Your Order', href: '/track-order' },
    { name: 'Shipping & Return Policy', href: '/shipping-policy' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const aboutUs = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  const paymentMethods = [
    { name: 'Visa', src: '/visa-icon.svg' },
    { name: 'Mastercard', src: '/mastercard-icon.svg' },
    { name: 'PayPal', src: '/paypal-icon.svg' },
    { name: 'Google Pay', src: '/google-pay-icon.svg' }
  ];

  return (
    <footer className="w-full bg-gray-50">
      <div className="mx-auto max-w-full px-8">
        {/* Newsletter Section */}
        <div className="flex justify-center py-12">
          <div className="flex items-center gap-6">
            <Image
              src="https://digitailpets.s3.ap-southeast-2.amazonaws.com/illustration/newsletter-illustration.jpg"
              alt="Pets Illustration"
              width={150}
              height={150}
              className="rounded-full"
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Sign Up for Newsletters & More!</h3>
              <Button variant="secondary" size="sm" className="w-fit">
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>

        {/* Main Links Section */}
        <div className="flex justify-center py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            {/* Customer Service */}
            <div>
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-3">
                {customerService.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <ul className="space-y-3">
                {aboutUs.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="font-semibold mb-4">Payment Methods</h3>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <Image
                    key={method.name}
                    src={method.src}
                    alt={method.name}
                    width={40}
                    height={25}
                    className="object-contain"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Connect With Us */}
        <div className="flex flex-col items-center py-12 border-t">
          <h3 className="font-semibold mb-4">Connect With Us</h3>
          <div className="flex gap-6">
            <Link href="https://facebook.com" className="text-gray-600 hover:text-gray-900">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="https://instagram.com" className="text-gray-600 hover:text-gray-900">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="https://twitter.com" className="text-gray-600 hover:text-gray-900">
              <Twitter className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center py-8 border-t">
          <p className="text-sm text-gray-600 mb-4">
            © 2024 DigiTailPets. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/policy" className="hover:text-gray-900">Policy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-gray-900">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;