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

    const trigger = gsap.fromTo(
      img,
      { y: '-8vh' },
      {
        y: '8vh',
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="science"
      ref={containerRef}
      className="skin-fitness relative w-full h-[70dvh] md:h-[100dvh] overflow-hidden"
    >
      {/* Background Image with Scrub Parallax */}
      <div
        ref={imgRef}
        className="absolute top-[-10dvh] left-0 w-full h-[120dvh] will-change-transform"
      >
        <Image
          src="/assets/skin-bg.jpg"
          alt="The skin fitness system"
          fill
          priority={false}
          className="object-cover object-center"
        />
      </div>

      {/* Heading positioned according to Stem Beauty */}
      <div className="absolute top-[15%] md:top-[22%] right-[5%] md:right-[8%] z-10 max-w-xl text-right px-6">
        <h2 className="font-metropolis font-normal text-3xl sm:text-5xl md:text-6xl lg:text-[68px] text-[#331b0f] uppercase leading-[1.08] tracking-tight drop-shadow-sm">
          The skin <br /> fitness system
        </h2>
      </div>
    </section>
  );
}
