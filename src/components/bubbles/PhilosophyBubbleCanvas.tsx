'use client';

import React, { useRef, useEffect, useState } from 'react';
import { createMarchingBubble, MarchingBubbleInstance } from './createMarchingBubble';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PhilosophyBubbleCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bubbleRef = useRef<MarchingBubbleInstance | null>(null);
  const [annotationsActive, setAnnotationsActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const isMobile = window.innerWidth <= 768;
    const targetScale = isMobile ? 1.05 : 1;

    // Initialize bubble simulation with the exact Stem Beauty settings
    const bubble = createMarchingBubble(
      canvas,
      {
        reveal: 0,
        collect: 0,
        alpha: 0,
        scale: 0.92 * targetScale,
        y: 0,
      },
      {
        desktopResolution: 112,
        mobileResolution: 68,
        maxPolyCount: 220000,
        pixelRatioLimit: 2,
        frameRate: 100,
        visibilityMargin: '360px',
        logoSrc: '/assets/logo.png',
        logoScale: 0.2,
        logoOpacity: 0.75,
        logoRevealStart: 0.55,
        logoZ: -0.24,
        logoMaskRadius: 2,
        logoMaskSoftness: 0.9,
        logoTint: 0x3b332c,
      }
    );
    bubbleRef.current = bubble;

    // GSAP ScrollTrigger to trigger coalescing animation
    const animState = {
      reveal: 0,
      collect: 0,
      alpha: 0,
      scale: 0.92 * targetScale,
      y: 0,
      pulse: 0,
    };

    const updateState = () => {
      bubble.setState(animState);
    };

    const tl = gsap.timeline({
      paused: true,
      onUpdate: updateState,
    });

    const duration = 3.6;

    tl.to(
      animState,
      {
        reveal: 1,
        alpha: 1,
        duration: 0.28 * duration,
        ease: 'sine.out',
      },
      0
    )
      .to(
        animState,
        {
          collect: 1,
          scale: targetScale,
          pulse: 0.24,
          duration: duration,
          ease: 'sine.inOut',
        },
        0
      )
      .to(
        animState,
        {
          pulse: 0,
          duration: 0.7,
          ease: 'sine.out',
        },
        `-=${0.7}`
      );

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        tl.play();
        setTimeout(() => setAnnotationsActive(true), 1200);
      },
    });

    return () => {
      trigger.kill();
      tl.kill();
      bubble.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[620px] md:h-[780px] flex items-center justify-center overflow-hidden my-4"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        id="sphere-canvas-1"
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Annotations 1: SUPPORTING (Top Right) */}
      <div
        className={`absolute top-[16%] md:top-[22%] right-[6%] md:right-[14%] max-w-[220px] transition-all duration-1000 ${
          annotationsActive
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-stem-rose animate-ping" />
          <strong className="font-degular text-sm md:text-base font-semibold tracking-wider text-stem-dark uppercase">
            SUPPORTING
          </strong>
        </div>
        <span className="text-xs md:text-sm text-stem-muted block leading-snug font-metropolis">
          the skin’s ability to withstand stress
        </span>
        <svg
          className="w-24 md:w-36 h-12 stroke-stem-rose stroke-[1.5] fill-none mt-2 hidden sm:block"
          viewBox="0 0 100 40"
        >
          <polyline points="0,35 60,35 95,5" />
          <circle cx="0" cy="35" r="3" fill="#D08C81" />
        </svg>
      </div>

      {/* Annotations 2: RECOVER (Center Left) */}
      <div
        className={`absolute top-[48%] md:top-[44%] left-[6%] md:left-[12%] max-w-[200px] transition-all duration-1000 delay-200 ${
          annotationsActive
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-stem-rose" />
          <strong className="font-degular text-sm md:text-base font-semibold tracking-wider text-stem-dark uppercase">
            RECOVER
          </strong>
        </div>
        <span className="text-xs md:text-sm text-stem-muted block leading-snug font-metropolis">
          faster from microscopic cellular micro-tears
        </span>
        <svg
          className="w-24 md:w-36 h-12 stroke-stem-rose stroke-[1.5] fill-none mt-2 hidden sm:block"
          viewBox="0 0 100 40"
        >
          <polyline points="100,5 40,5 5,35" />
          <circle cx="100" cy="5" r="3" fill="#D08C81" />
        </svg>
      </div>

      {/* Annotations 3: MAINTAIN (Bottom Right) */}
      <div
        className={`absolute bottom-[14%] md:bottom-[18%] right-[8%] md:right-[18%] max-w-[220px] transition-all duration-1000 delay-300 ${
          annotationsActive
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-stem-rose" />
          <strong className="font-degular text-sm md:text-base font-semibold tracking-wider text-stem-dark uppercase">
            MAINTAIN
          </strong>
        </div>
        <span className="text-xs md:text-sm text-stem-muted block leading-snug font-metropolis">
          peak epidermal barrier performance & optimal hydration
        </span>
        <svg
          className="w-24 md:w-36 h-12 stroke-stem-rose stroke-[1.5] fill-none mt-2 hidden sm:block"
          viewBox="0 0 100 40"
        >
          <polyline points="0,5 50,5 95,35" />
          <circle cx="0" cy="5" r="3" fill="#D08C81" />
        </svg>
      </div>
    </div>
  );
}

