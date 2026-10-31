'use client';

import React, { useRef, useEffect, useState } from 'react';
import { createMarchingBubble, MarchingBubbleInstance } from './createMarchingBubble';
import { ArrowRight } from 'lucide-react';

interface StepsStickyBubbleCanvasProps {
  activeStep: number;
  scrollProgress: number; // 0 to 1 across the steps section
  onShopClick?: () => void;
}

export default function StepsStickyBubbleCanvas({
  activeStep,
  scrollProgress,
  onShopClick,
}: StepsStickyBubbleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bubbleRef = useRef<MarchingBubbleInstance | null>(null);
  const [showShopButton, setShowShopButton] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth <= 1100;
    const baseScale = isMobile ? 1.35 : 0.84;

    const bubble = createMarchingBubble(
      canvas,
      {
        reveal: 1,
        collect: 1,
        alpha: 1,
        scale: baseScale,
        x: 0,
        y: 0,
        travel: 0,
        flowX: 0,
        flowY: 0,
        flowZ: 0,
        pulse: 0,
        rotateX: 0,
        rotateY: 0,
      },
      {
        desktopResolution: 104,
        mobileResolution: 64,
        maxPolyCount: 190000,
        pixelRatioLimit: 1.8,
        travelScatter: true,
        visibilityMargin: '420px',
        images: [
          '/assets/1.png',
          '/assets/2.png',
          '/assets/3.png',
          '/assets/4.png',
          '/assets/products-img.png',
        ],
        imageScale: 0.9,
        imageOpacity: 0.8,
        imageOffsetX: isMobile ? 0 : -0.07,
        imageScrub: 0.28,
        imageMaskRadius: 0.76,
        imageMaskSoftness: 0.2,
        imageRevealStart: 0,
        imageZ: -0.24,
        imageRotateYFactor: 0.04,
        imageRotateXFactor: 0.03,
      }
    );
    bubbleRef.current = bubble;

    return () => {
      bubble.destroy();
    };
  }, []);

  // Update bubble position and image texture when activeStep or scrollProgress changes
  useEffect(() => {
    const bubble = bubbleRef.current;
    const canvas = canvasRef.current;
    if (!bubble || !canvas) return;

    const isMobile = window.innerWidth <= 1100;
    const aspect = canvas.clientWidth / (canvas.clientHeight || 1);

    // Positions from Stem Beauty
    const positions = isMobile
      ? [
          { x: 0, y: 0.52 },
          { x: 0, y: 0.18 },
          { x: 0, y: -0.08 },
          { x: 0, y: -0.25 },
          { x: 0, y: 0.03 },
        ]
      : [
          { x: -1 * aspect * 0.7, y: 0.75 },
          { x: -0.4 * aspect * 0.7, y: 0.1 },
          { x: -0.9 * aspect * 0.7, y: -0.1 },
          { x: -0.3 * aspect * 0.7, y: 0.05 },
          { x: 0, y: 0.03 },
        ];

    // Calculate clamped step index and progress between steps
    const stepFloat = Math.max(0, Math.min(scrollProgress * 4, 4));
    const stepIdx = Math.min(Math.floor(stepFloat), positions.length - 2);
    const subProgress = stepFloat - stepIdx;

    const pA = positions[stepIdx];
    const pB = positions[stepIdx + 1];

    const ease = (t: number) => t * t * (3 - 2 * t);
    const easedSub = ease(subProgress);

    const currentX = pA.x + (pB.x - pA.x) * easedSub;
    const currentY = pA.y + (pB.y - pA.y) * easedSub;

    const flowX = (pB.x - pA.x) * Math.sin(easedSub * Math.PI) * 1.15;
    const flowY = (pB.y - pA.y) * Math.sin(easedSub * Math.PI) * 1.15;

    const isFinalStep = stepFloat >= 3.6;
    setShowShopButton(isFinalStep);

    bubble.setState({
      x: currentX,
      y: currentY,
      travel: easedSub,
      flowX,
      flowY,
      scale: isFinalStep ? 1.05 : 0.88,
      pulse: isFinalStep ? 0.08 : 0.02,
      rotateY: isFinalStep ? scrollProgress * Math.PI : 0,
    });

    // Cross-fade internal product texture
    const fromImg = Math.min(stepIdx, 4);
    const toImg = Math.min(stepIdx + 1, 4);
    bubble.setImageTransition(fromImg, toImg, easedSub);
  }, [scrollProgress, activeStep]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        id="sphere-canvas-2"
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Floating CTA Shop Button */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 ${
          showShopButton
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
            : 'opacity-0 translate-y-6 pointer-events-none scale-90'
        }`}
      >
        <button
          onClick={onShopClick}
          className="btn-stem-fill flex items-center gap-3 px-8 py-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-xs tracking-[0.16em]"
        >
          <span>SHOP THE 4-STEP RITUAL</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
