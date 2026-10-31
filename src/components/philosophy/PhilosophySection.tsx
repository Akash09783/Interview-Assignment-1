'use client';

import React from 'react';
import Image from 'next/image';
import PhilosophyBubbleCanvas from '@/components/bubbles/PhilosophyBubbleCanvas';

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="philosophy relative py-20 md:py-32 overflow-hidden bg-white">
      {/* Background Graphics matching Stem Beauty */}
      <div className="absolute top-[5%] -right-[15%] w-[80%] h-[60%] pointer-events-none opacity-40 rotate-180 scale-150">
        <Image
          src="/assets/bg1.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-0 -left-[15%] w-[80%] h-[70%] pointer-events-none opacity-30 scale-150">
        <Image
          src="/assets/bg2.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-[1720px] mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-6 md:mb-12">
          <h2 className="title inline-block font-metropolis uppercase text-xl md:text-2xl text-[#d08c81] tracking-[0.15em] pl-6 relative mb-8">
            our philosophy
          </h2>
          <h2 className="philosophy__title font-metropolis font-normal text-3xl sm:text-5xl md:text-6xl lg:text-[72px] text-[#331b0f] uppercase leading-[1.12] tracking-tight">
            Our products are designed as Skin Fitness Tools
          </h2>
        </div>

        {/* 3D Marching Cubes Bubble Canvas */}
        <PhilosophyBubbleCanvas />

        {/* Explore Science Button */}
        <div className="text-center mt-12">
          <a
            href="#science"
            className="button inline-block border border-[#331b0f] text-[#202020] text-xs uppercase tracking-widest px-10 py-3.5 relative overflow-hidden group font-metropolis"
          >
            <span className="block transition-transform duration-500 group-hover:translate-y-full">
              Explore our science
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-[#2d1c14] text-white -translate-y-full group-hover:translate-y-0 transition-transform duration-500"
            >
              Explore our science
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
