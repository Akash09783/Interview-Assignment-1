'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <footer className="footer bg-white text-[#202020] pt-20 pb-12 border-t border-[#e8e4e1]">
      <div className="max-w-[1720px] mx-auto px-6 md:px-12">
        <div className="footer__wrapper grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#e8e4e1]">
          {/* Left Column */}
          <div className="footer-left lg:col-span-6 flex flex-col justify-between">
            <Link
              href="/"
              className="footer-left__logo block w-48 sm:w-60 h-10 mb-8"
              aria-label="Beauty In Stem"
            >
              <Image
                src="/assets/logo.png"
                alt="Beauty In Stem"
                width={240}
                height={40}
                className="object-contain object-left"
              />
            </Link>

            <div className="footer-left__wrapper flex flex-col sm:flex-row gap-10 sm:gap-20">
              <ul className="footer-left__links space-y-3 font-metropolis text-xs sm:text-sm uppercase tracking-wider">
                <li>
                  <a href="#science" className="link-animation text-[#202020]">
                    Science
                  </a>
                </li>
                <li>
                  <a href="#philosophy" className="link-animation text-[#202020]">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#collection" className="link-animation text-[#202020]">
                    Shop
                  </a>
                </li>
                <li>
                  <a href="#faq" className="link-animation text-[#202020]">
                    Faq
                  </a>
                </li>
              </ul>

              <div className="footer-left__socials font-metropolis">
                <p className="text-xs uppercase tracking-widest text-[#4b4b4b] mb-3">
                  FOLLOW US:
                </p>
                <div className="flex flex-col space-y-2 text-xs uppercase tracking-wider font-medium">
                  <a
                    href="https://www.instagram.com/beautyinstemofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-animation link-animation--lined text-[#202020]"
                  >
                    INSTAGRAM
                  </a>
                  <a
                    href="https://www.tiktok.com/@beautyinstemofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-animation link-animation--lined text-[#202020]"
                  >
                    TIKTOK
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="footer-right lg:col-span-6 flex flex-col justify-between lg:pl-12">
            <div className="footer-right__wrapper">
              <h2 className="footer-right__title font-metropolis font-medium text-xl sm:text-2xl uppercase tracking-normal text-[#202020] mb-6">
                SUBSCRIBE TO OUR NEWSLETTERS
              </h2>

              <form onSubmit={handleSubmit} className="contact-form max-w-md">
                <div className="footer-right__submit flex items-center border-b border-[#202020] pb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-transparent text-sm text-[#202020] placeholder-[#4b4b4b]/60 focus:outline-none font-metropolis"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="button border border-[#331b0f] text-[#202020] hover:bg-[#331b0f] hover:text-white text-xs uppercase tracking-widest px-6 py-2 transition-all flex-shrink-0 font-metropolis"
                  >
                    <span>{status === 'loading' ? '...' : 'submit'}</span>
                  </button>
                </div>

                {message && (
                  <p
                    className={`mt-3 text-xs font-metropolis ${
                      status === 'success' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>

              <div className="footer-right__select mt-10 font-metropolis text-xs uppercase text-[#4b4b4b]">
                <p className="inline-block mr-3">SHOP IN:</p>
                <span className="font-semibold text-[#202020]">USD ($)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#4b4b4b] font-metropolis gap-4">
          <p>&copy; {new Date().getFullYear()} Beauty In Stem Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
