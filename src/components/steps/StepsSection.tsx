'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import StepsStickyBubbleCanvas from '@/components/bubbles/StepsStickyBubbleCanvas';
import { useCart } from '@/context/CartContext';
import { PRODUCTS_DATA } from '@/models/Product';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        const step = Math.min(3, Math.floor(self.progress * 4));
        setActiveStep(step);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const handleShopRitual = () => {
    PRODUCTS_DATA.forEach((prod) => addToCart(prod, 1));
  };

  return (
    <section
      id="steps"
      ref={sectionRef}
      className="steps relative bg-white py-24 md:py-36 overflow-clip"
    >
      {/* Background Graphic Overlays */}
      <div className="absolute -top-32 right-0 w-[60%] h-[50%] pointer-events-none opacity-20">
        <Image
          src="/assets/bg1.png"
          alt=""
          fill
          className="object-contain object-right-top"
        />
      </div>
      <div className="absolute bottom-20 left-0 w-[60%] h-[50%] pointer-events-none opacity-20">
        <Image
          src="/assets/bg2.png"
          alt=""
          fill
          className="object-contain object-left-bottom"
        />
      </div>

      {/* Section Title matching Stem Beauty */}
      <div className="max-w-[1720px] mx-auto px-6 md:px-12 mb-16 md:mb-28">
        <div className="steps__title flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-10">
          <div className="steps__title_number font-metropolis italic font-normal text-[#d08c81] text-[120px] sm:text-[180px] md:text-[240px] leading-[0.85]">
            4
          </div>
          <div className="steps__title_wrap max-w-xl text-center md:text-left">
            <h2 className="steps__title_title font-metropolis font-medium text-3xl sm:text-5xl md:text-6xl text-[#331b0f] uppercase leading-[1.1] mb-4">
              essential steps
            </h2>
            <p className="steps__title_descr font-metropolis text-base sm:text-xl md:text-2xl text-[#202020] leading-snug">
              that support recovery, strength, and long-term skin performance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Steps Container */}
      <div className="steps__main relative">
        {/* Sticky 3D WebGL Canvas Layer */}
        <div className="steps__sticky sticky top-0 w-full h-[100dvh] -mb-[100dvh] pointer-events-none z-10">
          <div className="w-full h-full pointer-events-auto">
            <StepsStickyBubbleCanvas
              activeStep={activeStep}
              scrollProgress={scrollProgress}
              onShopClick={handleShopRitual}
            />
          </div>
        </div>

        {/* Scrolling Step Text Blocks */}
        <div className="steps__wrapper max-w-[1400px] mx-auto px-6 md:px-12 relative z-20 space-y-48 md:space-y-72 py-32 pointer-events-none">
          {STEPS.map((step, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={idx}
                className={`steps-block pointer-events-auto flex items-start max-w-lg bg-white/75 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-black/5 shadow-sm transition-all duration-500 ${
                  isEven ? 'md:ml-auto' : 'md:mr-auto'
                }`}
              >
                <span className="steps-block__number font-metropolis font-extralight italic text-[#e8c5c1] text-5xl sm:text-7xl leading-none mr-6 flex-shrink-0">
                  {step.num}
                </span>
                <div className="steps-block__wrapper flex-1">
                  <h2 className="steps-block__title font-metropolis font-medium text-2xl sm:text-3xl text-[#202020] uppercase leading-none mb-2">
                    {step.title}
                  </h2>
                  <h3 className="steps-block__subtitle font-metropolis font-semibold text-xs sm:text-sm text-[#331b0f] uppercase tracking-wider mb-4">
                    {step.subtitle}
                  </h3>
                  <p className="steps-block__descr font-metropolis text-sm sm:text-base text-[#4b4b4b] leading-relaxed whitespace-pre-line">
                    {step.descr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
