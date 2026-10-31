'use client';

import React, { useRef, useEffect } from 'react';
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const isMobile = window.innerWidth <= 768;
    const targetScale = isMobile ? 2.5 : 1;

    // Line drawing SVG setup
    const lines = container.querySelectorAll('.philosophy__line');
    lines.forEach((line) => {
      const polyline = line.querySelector('polyline');
      const circles = line.querySelectorAll('circle');
      if (polyline) {
        const len = polyline.getTotalLength();
        gsap.set(polyline, { strokeDasharray: len, strokeDashoffset: len });
      }
      if (circles.length) {
        gsap.set(circles, { scale: 0, transformOrigin: '50% 50%' });
      }
    });

    const animateLines = () => {
      lines.forEach((line, idx) => {
        const polyline = line.querySelector('polyline');
        const circles = line.querySelectorAll('circle');
        if (polyline) {
          gsap
            .timeline({ delay: 0.04 * idx })
            .to(polyline, {
              strokeDashoffset: 0,
              duration: 1.5,
              ease: 'power2.inOut',
            })
            .to(
              circles,
              {
                scale: 1,
                duration: 0.45,
                stagger: 0.12,
                ease: 'back.out(1.7)',
              },
              '-=0.25'
            );
        }
      });
    };

    // Initialize bubble simulation with exact Stem Beauty parameters
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
        desktopResolution: 116,
        mobileResolution: 72,
        maxPolyCount: 220000,
        pixelRatioLimit: 2,
        frameRate: 100,
        visibilityMargin: '360px',
        logoSrc: '/assets/logo.png',
        logoScale: 0.2,
        logoOpacity: 0.7,
        logoRevealStart: 0.55,
        logoZ: -0.24,
        logoMaskRadius: 2,
        logoMaskSoftness: 0.9,
        logoTint: 3879212,
      }
    );
    bubbleRef.current = bubble;

    const animState = {
      reveal: 0,
      collect: 0,
      alpha: 0,
      scale: 0.92 * targetScale,
      y: 0,
      pulse: 0,
    };

    const updateState = () => bubble.setState(animState);

    const tl = gsap.timeline({
      paused: true,
      onUpdate: updateState,
    });

    const duration = 4.0;

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
        duration - 0.7
      );

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        tl.play();
        setTimeout(animateLines, 400);
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
      className="philosophy__sphere-wrap relative w-full h-[700px] md:h-[950px] overflow-hidden my-4"
    >
      {/* 3D WebGL Marching Cubes Canvas */}
      <canvas
        ref={canvasRef}
        id="sphere-canvas-1"
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* 1. SUPPORTING Annotation */}
      <div className="philosophy__annotation philosophy__annotation--supporting absolute top-[14%] right-[10%] md:right-[15%] pointer-events-none z-10">
        <strong className="philosophy__annotation-title block font-degular font-medium text-[28px] sm:text-[36px] md:text-[45px] text-[#331b0f] uppercase leading-none mb-1">
          SUPPORTING
        </strong>
        <span className="philosophy__annotation-desc block font-degular font-normal text-[16px] sm:text-[22px] md:text-[26px] text-[#331b0f] leading-snug">
          the skin’s ability to withstand stress
        </span>
        <svg
          className="philosophy__line philosophy__line--supporting w-[220px] md:w-[330px] h-[120px] md:h-[180px] overflow-visible"
          viewBox="20 -250 330 320"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="330" cy="0" r="5" fill="#D08C81" />
          <polyline points="330,0 150,50 80,180" stroke="#D08C81" strokeWidth="1.5" fill="none" />
          <circle cx="80" cy="180" r="3" fill="#D08C81" />
        </svg>
      </div>

      {/* 2. RECOVER Annotation */}
      <div className="philosophy__annotation philosophy__annotation--recover absolute top-[48%] left-[8%] md:left-[16%] pointer-events-none z-10">
        <strong className="philosophy__annotation-title block font-degular font-medium text-[28px] sm:text-[36px] md:text-[45px] text-[#331b0f] uppercase leading-none mb-1">
          RECOVER
        </strong>
        <span className="philosophy__annotation-desc block font-degular font-normal text-[16px] sm:text-[22px] md:text-[26px] text-[#331b0f] leading-snug">
          faster
        </span>
        <svg
          className="philosophy__line philosophy__line--recover w-[200px] md:w-[320px] h-[60px] overflow-visible"
          viewBox="-330 30 360 60"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="0" cy="0" r="5" fill="#D08C81" />
          <polyline points="0,0 200,0 240,50" stroke="#D08C81" strokeWidth="1.5" fill="none" />
          <circle cx="240" cy="50" r="3" fill="#D08C81" />
        </svg>
      </div>

      {/* 3. MAINTAIN Annotation */}
      <div className="philosophy__annotation philosophy__annotation--maintain absolute bottom-[18%] right-[10%] md:right-[18%] pointer-events-none z-10">
        <strong className="philosophy__annotation-title block font-degular font-medium text-[28px] sm:text-[36px] md:text-[45px] text-[#331b0f] uppercase leading-none mb-1">
          MAINTAIN
        </strong>
        <span className="philosophy__annotation-desc block font-degular font-normal text-[16px] sm:text-[22px] md:text-[26px] text-[#331b0f] leading-snug">
          optimal performance over time
        </span>
        <svg
          className="philosophy__line philosophy__line--maintain w-[200px] md:w-[300px] h-[160px] md:h-[220px] overflow-visible"
          viewBox="-130 -160 300 380"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="200" cy="250" r="5" fill="#D08C81" />
          <polyline points="200,250 10,210 -100,130" stroke="#D08C81" strokeWidth="1.5" fill="none" />
          <circle cx="-100" cy="130" r="3" fill="#D08C81" />
        </svg>
      </div>
    </div>
  );
}
