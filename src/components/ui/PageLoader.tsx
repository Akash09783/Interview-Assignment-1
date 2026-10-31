'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { createMarchingBubble } from '@/components/bubbles/createMarchingBubble';

export default function PageLoader() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const [progressVal, setProgressVal] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    const shadow = shadowRef.current;
    const counter = counterRef.current;
    if (!container || !canvas || !glow || !shadow || !counter) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsDone(true);
      return;
    }

    const isDesktop = window.innerWidth > 1100;

    // 1. Initialize MarchingCubes bubble instance with authentic Stem Beauty loader options
    const bubble = createMarchingBubble(
      canvas,
      {
        reveal: 0,
        collect: 0,
        alpha: 1,
        logoAlpha: 1,
        scale: isDesktop ? 1.2 : 1.5,
        x: 0,
        y: 0,
        pulse: 0,
        travel: 0,
        flowX: 0,
        flowY: 0,
        rotateY: 0,
        scatterSpread: 1,
      },
      {
        desktopResolution: 116,
        mobileResolution: 92,
        maxPolyCount: 200000,
        pixelRatioLimit: 2,
        pauseWhenHidden: false,
        travelScatter: true,
        logoSrc: '/assets/logo.png',
        logoScale: isDesktop ? 0.22 : 0.16,
        logoOpacity: 0.85,
        logoRevealStart: 0.52,
        logoZ: -0.24,
        logoMaskRadius: 2.0,
        logoMaskSoftness: 0.9,
        logoTint: 3879212,
      }
    );

    const animState = {
      progress: 0,
      reveal: 0,
      collect: 0,
      alpha: 1,
      logoAlpha: 1,
      scale: isDesktop ? 1.2 : 1.5,
      x: 0,
      y: 0,
      pulse: 0,
      travel: 0,
      flowX: 0,
      flowY: 0,
      rotateY: 0,
      scatterSpread: 1,
    };

    const updateBubble = () => {
      bubble.setState({
        reveal: animState.reveal,
        collect: animState.collect,
        alpha: animState.alpha,
        logoAlpha: animState.logoAlpha,
        scale: animState.scale,
        x: animState.x,
        y: animState.y,
        pulse: animState.pulse,
        travel: animState.travel,
        flowX: animState.flowX,
        flowY: animState.flowY,
        rotateY: animState.rotateY,
        scatterSpread: animState.scatterSpread,
      });
    };

    // Initial element sets
    gsap.set(counter, { opacity: 0 });
    gsap.set(glow, { xPercent: -50, yPercent: -50, scale: 0.35, opacity: 0 });
    gsap.set(shadow, { xPercent: -50, yPercent: -50, scale: 0.5, opacity: 0 });

    updateBubble();

    // 2. Coalescing & intro timeline
    const introTl = gsap.timeline({ onUpdate: updateBubble });

    introTl
      .to(glow, { opacity: 0.68, scale: 0.92, duration: 0.8, ease: 'sine.out' }, 0)
      .to(shadow, { opacity: 0.1, scale: 0.82, duration: 1.8, ease: 'sine.out' }, 0.35)
      .to(animState, { reveal: 1, duration: 1.35, ease: 'power3.out' }, 0)
      .to(animState, { collect: 1, duration: 2.6, ease: 'none' }, 0.4)
      .to(glow, { scale: 1.04, opacity: 0.42, duration: 2.2, ease: 'sine.inOut' }, 0.75)
      .to(counter, { opacity: 1, duration: 0.35, ease: 'sine.out' }, 1.8);

    // 3. Counter tween (0% -> 100%)
    gsap.to(animState, {
      progress: 100,
      duration: 2.8,
      delay: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        setProgressVal(Math.round(animState.progress));
      },
      onComplete: () => {
        setProgressVal(100);
        container.style.pointerEvents = 'none';

        // 4. Outro zoom and dissolve transition
        const outroTl = gsap.timeline({
          onUpdate: updateBubble,
          onComplete: () => {
            bubble.destroy();
            setIsDone(true);
            const video = document.querySelector<HTMLVideoElement>('.hero video');
            if (video) {
              video.play().catch(() => {});
            }
          },
        });

        outroTl
          .to(counter, { y: 25, opacity: 0, duration: 0.6, ease: 'power3.in' }, 0.2)
          .to(
            animState,
            {
              logoAlpha: 0,
              collect: 1,
              pulse: 0,
              x: 0,
              y: 0,
              travel: 0,
              flowX: 0,
              flowY: 0,
              duration: 0.6,
              ease: 'sine.inOut',
            },
            0.4
          )
          .to(
            animState,
            { flowX: 1, flowY: 1, travel: 0.6, scatterSpread: 2, duration: 2.0, ease: 'power2.out' },
            0.6
          )
          .to(
            animState,
            { scale: 22, rotateY: 15, y: 0, duration: 2.0, ease: 'sine.inOut' },
            0.8
          )
          .to([glow, shadow], { opacity: 0, duration: 0.8, ease: 'sine.inOut' }, 1.0)
          .to(animState, { alpha: 0, duration: 1.0, ease: 'sine.out' }, 1.2)
          .to(container, { opacity: 0, duration: 0.6, ease: 'sine.out' }, 1.6);
      },
    });

    return () => {
      introTl.kill();
      bubble.destroy();
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="page-loader fixed inset-0 z-[100000] bg-white overflow-hidden flex items-center justify-center pointer-events-auto"
    >
      {/* Background Soft Radial Glow */}
      <div
        ref={glowRef}
        className="page-loader__glow absolute top-1/2 left-1/2 w-[420px] md:w-[520px] h-[420px] md:h-[520px] rounded-full pointer-events-none z-0 blur-[18px]"
        style={{
          background:
            'radial-gradient(circle at 42% 38%, rgba(255,255,255,0.9) 0 18%, rgba(238,242,244,0.22) 44%, rgba(255,255,255,0) 70%), radial-gradient(circle, rgba(190,202,208,0.08), rgba(255,255,255,0) 66%)',
        }}
      />

      {/* Ambient Droplet Ground Shadow */}
      <div
        ref={shadowRef}
        className="page-loader__shadow absolute top-[58%] left-1/2 w-[300px] md:w-[480px] h-[60px] md:h-[90px] rounded-full pointer-events-none z-10 blur-[20px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(115,124,128,0.2) 0, rgba(156,164,168,0.11) 38%, rgba(255,255,255,0) 72%)',
        }}
      />

      {/* 3D WebGL Coalescing Bubble Canvas */}
      <canvas
        ref={canvasRef}
        className="page-loader__canvas absolute inset-0 w-full h-full block z-20"
      />

      {/* Elegant Bottom Loading Counter */}
      <div
        ref={counterRef}
        className="page-loader__counter absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-baseline font-degular font-normal text-[#202020] text-xl md:text-2xl select-none"
      >
        <span className="tabular-nums tracking-tight">{progressVal}</span>
        <span className="text-base md:text-lg ml-1 font-light">%</span>
      </div>
    </div>
  );
}
