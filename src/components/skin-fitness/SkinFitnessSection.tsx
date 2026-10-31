'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SkinFitnessSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const trigger = gsap.to(img, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="science"
      ref={containerRef}
      className="relative w-full h-[580px] md:h-[720px] overflow-hidden flex items-center justify-center"
    >
      {/* Background Editorial Image with Parallax */}
      <div
        ref={imgRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] -z-10"
      >
        <Image
          src="/assets/skin-bg.jpg"
          alt="The skin fitness system"
          fill
          priority={false}
          className="object-cover object-center filter brightness-[0.88]"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Editorial Content */}
      <div className="max-w-[1720px] mx-auto px-6 md:px-12 text-center text-white z-10">
        <p className="text-xs uppercase tracking-[0.24em] font-medium text-white/80 mb-4 font-metropolis">
          Korean Formulations &bull; Cellular Innovation
        </p>
        <h2 className="font-degular text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[0.98] tracking-tight text-white drop-shadow-md max-w-4xl mx-auto">
          The skin fitness system
        </h2>
        <p className="mt-6 text-xs sm:text-sm md:text-base text-white/90 font-metropolis max-w-lg mx-auto leading-relaxed drop-shadow">
          Engineered in Seoul’s advanced dermatological laboratories. Delivering pharmaceutical-grade
          PDRN for visible regeneration, luminous tone, and resilient elasticity.
        </p>
      </div>
    </section>
  );
}
