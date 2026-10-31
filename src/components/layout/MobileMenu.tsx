'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#EDE8E1] px-6 py-8 md:hidden transition-all duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link href="/" onClick={onClose} className="relative w-36 h-8">
          <Image
            src="/assets/logo.png"
            alt="Beauty In Stem"
            fill
            className="object-contain"
          />
        </Link>
        <button
          onClick={onClose}
          className="text-2xl p-2 text-stem-dark hover:opacity-70 transition-opacity"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col space-y-6 my-auto text-3xl font-degular tracking-tight text-stem-dark">
        <a
          href="#science"
          onClick={onClose}
          className="flex items-center gap-3 transition-transform hover:translate-x-2"
        >
          <span className="w-2 h-2 rounded-full bg-stem-rose" />
          <span>Science</span>
        </a>
        <a
          href="#philosophy"
          onClick={onClose}
          className="flex items-center gap-3 transition-transform hover:translate-x-2"
        >
          <span className="w-2 h-2 rounded-full bg-stem-rose" />
          <span>Philosophy</span>
        </a>
        <a
          href="#collection"
          onClick={onClose}
          className="flex items-center gap-3 transition-transform hover:translate-x-2"
        >
          <span className="w-2 h-2 rounded-full bg-stem-rose" />
          <span>Shop Collection</span>
        </a>
        <a
          href="#steps"
          onClick={onClose}
          className="flex items-center gap-3 transition-transform hover:translate-x-2"
        >
          <span className="w-2 h-2 rounded-full bg-stem-rose" />
          <span>The 4 Steps</span>
        </a>
        <a
          href="#account"
          onClick={onClose}
          className="flex items-center gap-3 transition-transform hover:translate-x-2 text-xl tracking-wider uppercase font-metropolis font-normal pt-4"
        >
          <span>Account Login</span>
        </a>
      </nav>

      {/* Footer / Socials */}
      <div className="border-t border-black/10 pt-6">
        <p className="text-xs uppercase tracking-[0.14em] text-stem-muted mb-3">
          Follow Beauty In Stem
        </p>
        <div className="flex space-x-6 text-xs uppercase tracking-wider font-semibold">
          <a
            href="https://www.instagram.com/beautyinstemofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="link-animation"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@beautyinstemofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="link-animation"
          >
            TikTok
          </a>
        </div>
      </div>
    </div>
  );
}

