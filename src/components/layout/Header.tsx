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
      <header className="fixed top-0 left-0 w-full z-40 bg-[#ffffffd1] backdrop-blur-md border-b border-[#e8e4e1]/60 transition-all">
        <div className="w-full px-4 md:px-12 h-[54px] md:h-[76px] flex items-center justify-between relative">
          {/* Left Navigation (Desktop Only) */}
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

          {/* Logo: Aligned on the Left on Mobile, Centered on Desktop */}
          <Link
            href="/"
            className="flex items-center shrink-0 w-[95px] md:w-[145px] h-[26px] md:h-[38px] md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 transition-transform duration-300 hover:scale-[1.01]"
            aria-label="Beauty In Stem"
          >
            <Image
              src="/assets/logo.png"
              alt="Beauty In Stem"
              width={145}
              height={38}
              priority
              className="object-contain w-full h-full"
            />
          </Link>

          {/* Right Navigation (Desktop Only) */}
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

          {/* Mobile Actions: Account, Bag, Burger Menu (Matching Stem Beauty Mobile) */}
          <div className="flex items-center gap-4 md:hidden ml-auto">
            {/* Account Icon */}
            <a
              href="#account"
              className="flex items-center justify-center p-1 text-[#331b0f]"
              aria-label="Account"
            >
              <Image
                src="/assets/login.svg"
                alt="Account"
                width={18}
                height={18}
                className="w-[18px] h-[18px]"
              />
            </a>

            {/* Shopping Bag Icon (clean outline, no badge on mobile) */}
            <button
              onClick={openCart}
              className="flex items-center justify-center p-1 text-[#331b0f] cursor-pointer"
              aria-label="Shopping Cart"
            >
              <Image
                src="/assets/bag.svg"
                alt="Cart"
                width={18}
                height={18}
                className="w-[18px] h-[18px]"
              />
            </button>

            {/* Authentic 3-Bar Burger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex flex-col justify-between items-end w-[24px] h-[16px] p-0 border-0 bg-transparent cursor-pointer ml-1"
              aria-label="Open navigation menu"
            >
              <span className="block h-[1.8px] bg-[#331b0f] w-full" />
              <span className="block h-[1.8px] bg-[#331b0f] w-[60%]" />
              <span className="block h-[1.8px] bg-[#331b0f] w-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
