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

const STEPS_DATA = [
  {
    number: '1/',
    title: 'Cleanse',
    subtitle: 'HYDRA-FOAM CLEANSER',
    description:
      'A recovery-first cleansing step that purifies while preserving the skin barrier from the very first contact. Leaves skin balanced, supple, and prepared for bio-cellular actives.',
    keyAction: 'Purifies without stripping lipid layers',
    productId: 'hydra-foam-cleanser',
  },
  {
    number: '2/',
    title: 'Repair',
    subtitle: 'RESET SERUM',
    description:
      'A potent multi-action peptide and cellular repair serum engineered to target environmental stress, restore elasticity, and accelerate tissue recovery kinetics.',
    keyAction: 'Bio-stimulates collagen & elastin synthesis',
    productId: 'reset-serum',
  },
  {
    number: '3/',
    title: 'Nourish',
    subtitle: 'HYDRA-NUTRITION STICK',
    description:
      'Portable, multi-depth moisture nourishment in a solid balmy stick. Glides seamlessly over skin to instantly infuse salmon DNA, essential ceramides, and vital lipids.',
    keyAction: 'Instant multi-depth barrier nourishment',
    productId: 'hydra-nutrition-stick',
  },
  {
    number: '4/',
    title: 'Shield',
    subtitle: 'BARRIER RECOVERY CREAM',
    description:
      'The final seal in the skin fitness system. Formulated to fortify lipid bilayers, trap essential moisture, and shield against oxidative stress.',
    keyAction: 'Continuous 24-hour lipid barrier lockdown',
    productId: 'barrier-recovery-cream',
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
    // Add all 4 ritual products into cart
    PRODUCTS_DATA.forEach((prod) => addToCart(prod, 1));
  };

  return (
    <section
      id="steps"
      ref={sectionRef}
      className="relative bg-[#EDE8E1] min-h-[300vh] py-24 md:py-32"
    >
      {/* Background Graphic Overlays */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-20">
        <Image
          src="/assets/bg1.png"
          alt=""
          fill
          className="object-cover object-top"
        />
      </div>

      {/* Top Section Intro */}
      <div className="max-w-[1720px] mx-auto px-6 md:px-12 mb-16">
        <div className="flex items-start gap-6 max-w-4xl">
          <div className="font-degular text-7xl sm:text-8xl md:text-9xl text-stem-dark font-light leading-none">
            4
          </div>
          <div>
            <h2 className="font-degular text-3xl sm:text-5xl md:text-6xl text-stem-dark font-normal tracking-tight">
              essential steps
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-stem-muted font-metropolis max-w-xl leading-relaxed">
              that support recovery, strength, and long-term skin performance through sequential
              cellular stimulation.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Main Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col md:flex-row items-center justify-between max-w-[1720px] mx-auto px-6 md:px-12 pointer-events-none">
        {/* Step Text Info Panel (Left on desktop) */}
        <div className="w-full md:w-1/2 z-20 pointer-events-auto flex flex-col justify-center h-full py-8">
          <div className="max-w-md bg-[#EDE8E1]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-black/10 shadow-sm transition-all duration-500">
            <div className="flex items-center gap-3 text-stem-rose font-mono text-sm tracking-widest font-semibold mb-2">
              <span>STEP {STEPS_DATA[activeStep].number}</span>
              <span className="w-12 h-[1px] bg-stem-rose" />
              <span className="text-stem-muted text-xs uppercase font-metropolis">
                Active Protocol
              </span>
            </div>

            <h3 className="font-degular text-3xl sm:text-4xl text-stem-dark font-normal mb-1">
              {STEPS_DATA[activeStep].title}
            </h3>
            <h4 className="text-xs uppercase tracking-[0.16em] text-stem-muted font-semibold mb-4 font-metropolis">
              {STEPS_DATA[activeStep].subtitle}
            </h4>

            <p className="text-xs sm:text-sm text-stem-dark/80 font-metropolis leading-relaxed mb-4">
              {STEPS_DATA[activeStep].description}
            </p>

            <div className="bg-[#E3DDD4] px-3.5 py-2 rounded-lg text-[11px] font-medium text-stem-dark mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>{STEPS_DATA[activeStep].keyAction}</span>
            </div>

            <button
              onClick={() => {
                const prod = PRODUCTS_DATA.find((p) => p.id === STEPS_DATA[activeStep].productId);
                if (prod) addToCart(prod, 1);
              }}
              className="btn-stem text-xs"
            >
              Add Step {activeStep + 1} to Cart
            </button>
          </div>

          {/* Step Progress Indicators */}
          <div className="flex items-center gap-3 mt-8">
            {STEPS_DATA.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  window.scrollTo({
                    top:
                      (sectionRef.current?.offsetTop || 0) +
                      (idx / 4) * (sectionRef.current?.offsetHeight || 1),
                    behavior: 'smooth',
                  });
                }}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeStep ? 'w-10 bg-stem-dark' : 'w-4 bg-black/15'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3D Sticky Marching Cubes Canvas (Right on desktop) */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-[80vh] relative z-10 pointer-events-auto">
          <StepsStickyBubbleCanvas
            activeStep={activeStep}
            scrollProgress={scrollProgress}
            onShopClick={handleShopRitual}
          />
        </div>
      </div>

      {/* Spacer div to allow scrolling through steps */}
      <div className="h-[250vh] pointer-events-none" />
    </section>
  );
}

