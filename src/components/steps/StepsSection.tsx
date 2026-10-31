'use client';

import React from 'react';
import Image from 'next/image';
import StepsStickyBubbleCanvas from '@/components/bubbles/StepsStickyBubbleCanvas';
import { useCart } from '@/context/CartContext';
import { PRODUCTS_DATA } from '@/models/Product';

const STEPS = [
  {
    num: '1/',
    title: 'Cleanse',
    subtitle: 'HYDRA-FOAM CLEANSER',
    descr:
      'A recovery-first cleansing step that purifies while preserving the skin barrier from the very first contact. Leaves your skin feeling clean and hydrated.',
    productId: 'hydra-foam-cleanser',
  },
  {
    num: '2/',
    title: 'Activate',
    subtitle: 'RESET SERUM',
    descr:
      'A targeted activation serum that stimulates the skin cells in regaining strength, density, and balance — preparing it for sustained resilience.\n\nResulting in a more youthful, glowy texture.',
    productId: 'reset-serum',
  },
  {
    num: '3/',
    title: 'Recovery',
    subtitle: 'HYDRA-NUTRITION ESSENCE',
    descr:
      'A barrier-training moisturiser designed to strengthen the skin\'s tolerance over time, reinforcing hydration, structure, and defensive function.\n\nThis light milky formula leaves your skin brighter and well hydrated.',
    productId: 'hydra-nutrition-essence',
  },
  {
    num: '4/',
    title: 'MAINTAIN',
    subtitle: 'EYE & LASH CONDITIONER',
    descr:
      'A multi-tasking eye fitness serum formulated to support the skin around the eyes and lashes, where is it most delicate.\n\nEye skin and lashes will appears thicker over time, reducing dark areas and crepiness.',
    productId: 'lash-and-eye-conditioner',
  },
];

export default function StepsSection() {
  const { addToCart } = useCart();

  const handleShopRitual = () => {
    PRODUCTS_DATA.forEach((prod) => addToCart(prod, 1));
  };

  return (
    <section id="steps" className="steps relative bg-white overflow-clip pt-28 md:pt-40">
      {/* Background Graphic Overlays matching Stem Beauty */}
      <img
        src="/assets/bg1.png"
        alt=""
        className="steps-bg1 absolute right-0 top-[-300px] w-full scale-150 pointer-events-none select-none opacity-40"
      />
      <img
        src="/assets/bg2.png"
        alt=""
        className="steps-bg2 absolute left-0 bottom-[200px] w-full scale-125 pointer-events-none select-none opacity-40"
      />

      {/* Section Title matching Stem Beauty */}
      <div className="container max-w-[1720px] mx-auto px-6 md:px-12 mb-20 md:mb-32 relative z-10">
        <div className="steps__title flex items-center justify-center gap-6 md:gap-12">
          <div className="steps__title_number font-metropolis italic font-normal text-[#d08c81] text-[120px] sm:text-[180px] md:text-[240px] lg:text-[320px] leading-[0.8] select-none">
            4
          </div>
          <div className="steps__title_wrap max-w-xl">
            <h2 className="steps__title_title font-metropolis font-medium text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#331b0f] uppercase leading-[1.05] mb-3">
              essential steps
            </h2>
            <p className="steps__title_descr font-metropolis text-base sm:text-xl md:text-2xl text-[#202020] leading-snug">
              that support recovery, strength, and long-term skin performance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Steps Container */}
      <div className="steps__main relative pb-[60dvh]">
        {/* Sticky 3D WebGL Canvas Layer */}
        <div className="steps__sticky sticky top-0 w-full h-[100dvh] -mb-[100dvh] pointer-events-none z-10">
          <div className="w-full h-full pointer-events-auto">
            <StepsStickyBubbleCanvas onShopClick={handleShopRitual} />
          </div>
        </div>

        {/* Scrolling Step Text Blocks */}
        <div className="steps__wrapper container max-w-[1400px] mx-auto px-6 md:px-12 relative z-20 pointer-events-none">
          {STEPS.map((step, idx) => {
            const isRightSide = idx % 2 === 1;
            return (
              <div
                key={idx}
                data-step={idx}
                className={`steps-block pointer-events-auto flex items-start max-w-[580px] mb-[260px] md:mb-[340px] last:mb-0 transition-all ${
                  isRightSide ? 'ml-auto mr-4 md:mr-12' : 'ml-auto mr-4 md:mr-24 lg:mr-32'
                }`}
              >
                {/* Step Number in coral italic */}
                <span className="steps-block__number font-metropolis font-extralight italic text-[#e8c5c1] text-6xl sm:text-7xl md:text-8xl leading-none mr-6 md:mr-8 flex-shrink-0 select-none">
                  {step.num}
                </span>

                <div className="steps-block__wrapper flex-1 pt-1">
                  <h2 className="steps-block__title font-metropolis font-medium text-3xl sm:text-4xl text-[#202020] uppercase leading-none mb-2.5">
                    {step.title}
                  </h2>
                  <h3 className="steps-block__subtitle font-metropolis font-normal text-xs sm:text-sm text-[#331b0f] uppercase tracking-wider mb-4">
                    {step.subtitle}
                  </h3>
                  <p className="steps-block__descr font-metropolis text-sm sm:text-base text-[#4b4b4b] leading-relaxed whitespace-pre-line">
                    {step.descr}
                  </p>

                  {/* Scroll Down indicator on Step 4 matching Stem Beauty */}
                  {idx === STEPS.length - 1 && (
                    <div className="steps-block__scroll flex items-center gap-2.5 mt-10 text-xs font-metropolis uppercase tracking-widest text-[#4b4b4b]">
                      <span className="steps-block__scroll-icon w-3.5 h-4.5 overflow-hidden relative inline-block">
                        <span className="steps-block__scroll-track flex flex-col absolute inset-0 animate-bounce">
                          <svg viewBox="0 0 16 20" className="w-3.5 h-4.5 stroke-[#4b4b4b]" fill="none" strokeWidth="1.8">
                            <path d="M8 1V14M8 14L2 8M8 14L14 8" strokeLinecap="square" strokeLinejoin="miter" />
                          </svg>
                        </span>
                      </span>
                      <span className="steps-block__scroll-text">SCROLL DOWN</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra 150dvh scroll expand zone for final 4-products reveal and SHOP button */}
        <div className="steps__expand h-[150dvh] relative z-0 pointer-events-none" />
      </div>
    </section>
  );
}
