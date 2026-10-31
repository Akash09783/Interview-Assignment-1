'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { openCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex flex-col justify-between bg-white w-full h-[100dvh] overflow-hidden md:hidden transition-all duration-300">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#e8e4e1] bg-white">
        <Link href="/" onClick={onClose} className="w-[95px] flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Beauty In Stem"
            width={95}
            height={26}
            priority
            className="w-full h-auto object-contain"
          />
        </Link>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-metropolis font-normal uppercase tracking-wider text-[#331b0f] cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="Close menu"
        >
          <span>CLOSE</span>
          <span className="text-sm font-light leading-none">✕</span>
        </button>
      </div>

      {/* Center Nav Links with Wave Background & Coral Dots */}
      <div
        className="flex-1 flex flex-col items-center justify-center gap-7 py-10 px-5 relative bg-[#f5f2f0] overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/burger-bg.png)',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      >
        {/* First Coral Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#d08c81] shrink-0" />

        {/* Navigation Items */}
        <a
          href="#science"
          onClick={onClose}
          className="font-metropolis text-lg sm:text-xl uppercase tracking-wider text-[#202020] hover:text-[#d08c81] transition-colors"
        >
          SCIENCE
        </a>
        <a
          href="#philosophy"
          onClick={onClose}
          className="font-metropolis text-lg sm:text-xl uppercase tracking-wider text-[#202020] hover:text-[#d08c81] transition-colors"
        >
          US
        </a>
        <a
          href="#collection"
          onClick={onClose}
          className="font-metropolis text-lg sm:text-xl uppercase tracking-wider text-[#202020] hover:text-[#d08c81] transition-colors"
        >
          SHOP
        </a>

        {/* Second Coral Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#d08c81] shrink-0" />

        <a
          href="#account"
          onClick={onClose}
          className="font-metropolis text-lg sm:text-xl uppercase tracking-wider text-[#202020] hover:text-[#d08c81] transition-colors"
        >
          ACCOUNT
        </a>
        <button
          onClick={() => {
            onClose();
            openCart();
          }}
          className="font-metropolis text-lg sm:text-xl uppercase tracking-wider text-[#202020] hover:text-[#d08c81] transition-colors cursor-pointer"
        >
          SHOPPING CART
        </button>
      </div>

      {/* Bottom Follow Us Section */}
      <div className="flex flex-col items-center gap-2.5 py-6 border-t border-[#e8e4e1] bg-white">
        <p className="font-metropolis text-[11px] uppercase tracking-[0.14em] text-[#202020]">
          FOLLOW US:
        </p>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-metropolis text-sm uppercase underline tracking-wider text-[#202020] hover:text-[#d08c81] transition-colors"
        >
          INSTAGRAM
        </a>
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-metropolis text-sm uppercase underline tracking-wider text-[#202020] hover:text-[#d08c81] transition-colors"
        >
          TIKTOK
        </a>
      </div>
    </div>
  );
}
