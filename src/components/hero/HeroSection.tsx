'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    const title = titleRef.current;
    if (!hero || !video || !title) return;

    // Smooth video parallax on scroll
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

    // Fade and elevate title slightly on scroll
    const titleTrigger = gsap.to(title, {
      opacity: 0.2,
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '80% top',
        scrub: true,
      },
    });

    return () => {
      trigger.kill();
      titleTrigger.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] flex items-end justify-start overflow-hidden pb-16 md:pb-24"
    >
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/hero-video.mp4"
          muted
          loop
          autoPlay
          playsInline
          className="w-full h-full object-cover scale-105"
        />
        {/* Subtle cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="max-w-[1720px] w-full mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-end justify-between gap-8 z-10">
        <div ref={titleRef} className="max-w-4xl text-white">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-medium text-white/80 mb-3 font-metropolis">
            Bio-Cellular Fitness Skincare
          </p>
          <h1 className="font-degular text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-normal leading-[0.98] tracking-tight text-white drop-shadow-sm">
            <span>Korean Formulas</span>
            <br />
            <span className="font-light italic text-white/90">engineered for</span>{' '}
            <br className="hidden sm:inline" />
            <span>ultimate skin fitness</span>
          </h1>
        </div>

        {/* Scroll prompt */}
        <a
          href="#collection"
          className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group cursor-pointer"
          aria-label="Scroll to collection"
        >
          <span className="text-[11px] uppercase tracking-[0.2em] font-medium">
            Explore Ritual
          </span>
          <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white transition-colors group-hover:translate-y-1 duration-300">
            <ArrowDown className="w-4 h-4 text-white" />
          </div>
        </a>
      </div>
    </section>
  );
}

