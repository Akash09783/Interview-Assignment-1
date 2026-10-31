'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;

    const trigger = gsap.to(video, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
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
      ref={heroRef}
      className="hero relative w-full h-[100dvh] overflow-hidden bg-black"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/assets/hero-video.mp4"
        muted
        loop
        autoPlay
        playsInline
        className="absolute top-[-30px] md:top-[-50px] left-0 w-full h-[115dvh] object-cover"
      />

      {/* Hero Title - Centered at Bottom Matching stembeauty.com */}
      <div className="hero__title absolute bottom-[40px] md:bottom-[50px] left-1/2 -translate-x-1/2 w-full z-10 px-4 pointer-events-none">
        <h1 className="text-center">
          <span className="block text-white font-metropolis font-bold uppercase tracking-normal text-[32px] sm:text-[48px] md:text-[60px] lg:text-[70px] leading-none mb-3 md:mb-5 drop-shadow-md">
            Korean Formulas
          </span>
          <span className="block text-white font-metropolis font-normal lowercase text-[22px] sm:text-[32px] md:text-[42px] lg:text-[48px] leading-[1.15] drop-shadow-md">
            engineered for <br /> ultimate skin fitness
          </span>
        </h1>
      </div>
    </section>
  );
}
