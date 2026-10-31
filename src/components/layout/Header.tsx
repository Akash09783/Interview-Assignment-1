'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { openCart, totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-black/5 transition-all">
        <div className="w-full px-6 md:px-12 h-[68px] md:h-[76px] flex items-center justify-between relative">
          {/* Left Navigation (Desktop) */}
          <nav
            className="hidden md:flex items-center space-x-12 flex-1 justify-start font-metropolis text-[14px] lg:text-[15px] tracking-[0.08em] uppercase text-[#202020]"
            aria-label="Main navigation"
          >
            <a href="#science" className="link-animation hover:text-black font-normal">
              Science
            </a>
            <a href="#philosophy" className="link-animation hover:text-black font-normal">
              Us
            </a>
            <a href="#collection" className="link-animation hover:text-black font-normal">
              Shop
            </a>
          </nav>

          {/* Center Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-[120px] md:w-[145px] h-[32px] md:h-[38px] transition-transform duration-300 hover:scale-[1.01]"
            aria-label="Beauty In Stem"
          >
            <Image
              src="/assets/logo.png"
              alt="Beauty In Stem"
              width={145}
              height={38}
              priority
              className="object-contain h-full w-auto"
            />
          </Link>

          {/* Right Navigation (Desktop) */}
          <nav
            className="hidden md:flex items-center space-x-12 flex-1 justify-end font-metropolis text-[14px] lg:text-[15px] tracking-[0.08em] uppercase text-[#202020]"
            aria-label="User navigation"
          >
            <a href="#account" className="link-animation hover:text-black font-normal">
              ACCOUNT
            </a>
            <button
              onClick={openCart}
              className="link-animation hover:text-black font-normal uppercase cursor-pointer"
              aria-label="Open cart"
            >
              SHOPPING CART {totalItems > 0 ? `(${totalItems})` : ''}
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-5 md:hidden ml-auto">
            <a href="#account" className="p-1" aria-label="Account">
              <Image
                src="/assets/login.svg"
                alt="Account"
                width={22}
                height={22}
                className="w-5 h-5 opacity-90"
              />
            </a>

            <button
              onClick={openCart}
              className="relative p-1"
              aria-label="Shopping Cart"
            >
              <Image
                src="/assets/bag.svg"
                alt="Cart"
                width={22}
                height={22}
                className="w-5 h-5 opacity-90"
              />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-stem-rose text-white text-[9px] flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Burger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 flex flex-col justify-center items-end gap-1.5 w-7 h-7"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={`w-6 h-[1.8px] bg-[#331b0f] transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-4 h-[1.8px] bg-[#331b0f] transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-6 h-[1.8px] bg-[#331b0f] transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
