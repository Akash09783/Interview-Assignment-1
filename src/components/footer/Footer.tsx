'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

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
        setMessage(data.error || 'Subscription failed. Please check your email.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <footer className="bg-[#141414] text-[#EDE8E1] pt-20 pb-12 overflow-hidden border-t border-white/10">
      <div className="max-w-[1720px] mx-auto px-6 md:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Left Column: Brand & Links */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <Link
              href="/"
              className="relative w-48 sm:w-64 h-12 block filter invert brightness-150 mb-10"
              aria-label="Beauty In Stem"
            >
              <Image
                src="/assets/logo.png"
                alt="Beauty In Stem"
                fill
                className="object-contain object-left"
              />
            </Link>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#EDE8E1]/40 font-mono mb-4">
                  Navigation
                </p>
                <ul className="space-y-3 text-xs tracking-wider uppercase font-medium">
                  <li>
                    <a href="#science" className="link-animation text-[#EDE8E1]/80 hover:text-white">
                      Science
                    </a>
                  </li>
                  <li>
                    <a href="#philosophy" className="link-animation text-[#EDE8E1]/80 hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#collection" className="link-animation text-[#EDE8E1]/80 hover:text-white">
                      Shop Ritual
                    </a>
                  </li>
                  <li>
                    <a href="#steps" className="link-animation text-[#EDE8E1]/80 hover:text-white">
                      The 4 Steps
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#EDE8E1]/40 font-mono mb-4">
                  Follow Us
                </p>
                <ul className="space-y-3 text-xs tracking-wider uppercase font-medium">
                  <li>
                    <a
                      href="https://www.instagram.com/beautyinstemofficial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-animation link-animation--lined text-[#EDE8E1]/80 hover:text-white"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.tiktok.com/@beautyinstemofficial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-animation link-animation--lined text-[#EDE8E1]/80 hover:text-white"
                    >
                      TikTok
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#EDE8E1]/40 font-mono mb-4">
                  Formulation
                </p>
                <p className="text-xs text-[#EDE8E1]/60 font-metropolis leading-relaxed">
                  Engineered with medical-grade PDRN Salmon DNA in Seoul, Korea. Cruelty-free & dermatologist tested.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Newsletter Subscription */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-stem-rose font-mono mb-2">
                Stay Informed
              </p>
              <h3 className="font-degular text-2xl sm:text-3xl font-normal text-white mb-3">
                Join the Skin Fitness Community
              </h3>
              <p className="text-xs text-[#EDE8E1]/70 leading-relaxed mb-6 font-metropolis max-w-md">
                Receive private invitations to clinical formulation releases, dermatological research whitepapers, and exclusive launch offers.
              </p>

              {/* Newsletter Form */}
              <form onSubmit={handleSubmit} className="relative max-w-md">
                <div className="flex items-center border-b border-white/30 focus-within:border-white transition-colors pb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-metropolis"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="p-2 text-white hover:text-stem-rose transition-colors disabled:opacity-50"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {message && (
                  <div
                    className={`mt-3 text-xs flex items-center gap-2 ${
                      status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {status === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{message}</span>
                  </div>
                )}
              </form>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-xs text-[#EDE8E1]/50">
              <span>Currency: USD ($)</span>
              <span>Seoul &bull; New York</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#EDE8E1]/50 font-metropolis gap-4">
          <p>&copy; {new Date().getFullYear()} Beauty In Stem Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Shipping & Returns
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
