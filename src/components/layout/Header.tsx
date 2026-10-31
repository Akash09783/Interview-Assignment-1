'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { totalItems, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#EDE8E1]/90 backdrop-blur-md border-b border-black/5 py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left Navigation (Desktop) */}
          <nav
            className="hidden md:flex items-center space-x-10 text-[0.8125rem] tracking-[0.14em] uppercase font-medium text-stem-dark"
            aria-label="Main navigation"
          >
            <a href="#science" className="link-animation hover:text-black">
              Science
            </a>
            <a href="#philosophy" className="link-animation hover:text-black">
              Us
            </a>
            <a href="#collection" className="link-animation hover:text-black">
              Shop
            </a>
          </nav>

          {/* Center Logo */}
          <Link
            href="/"
            className="relative block w-40 md:w-56 h-8 md:h-10 transition-transform duration-300 hover:scale-[1.02]"
            aria-label="Beauty In Stem"
          >
            <Image
              src="/assets/logo.png"
              alt="Beauty In Stem"
              fill
              priority
              className="object-contain"
            />
          </Link>

          {/* Right Navigation (Desktop) */}
          <nav
            className="hidden md:flex items-center space-x-10 text-[0.8125rem] tracking-[0.14em] uppercase font-medium text-stem-dark"
            aria-label="User navigation"
          >
            <a href="#account" className="link-animation hover:text-black">
              ACCOUNT
            </a>
            <button
              onClick={openCart}
              className="link-animation hover:text-black flex items-center gap-2 cursor-pointer uppercase"
              aria-label="Open cart"
            >
              <span>SHOPPING CART</span>
              <span className="w-5 h-5 rounded-full bg-stem-dark text-white text-[10px] flex items-center justify-center font-mono">
                {totalItems}
              </span>
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-5 md:hidden">
            <button
              onClick={openCart}
              className="relative p-1"
              aria-label="Shopping Cart"
            >
              <Image
                src="/assets/bag.svg"
                alt="Cart"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-stem-rose text-white text-[9px] flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 flex flex-col justify-center items-center gap-1.5 w-7 h-7"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={`w-6 h-[1.5px] bg-stem-dark transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-6 h-[1.5px] bg-stem-dark transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-6 h-[1.5px] bg-stem-dark transition-all duration-300 ${
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
