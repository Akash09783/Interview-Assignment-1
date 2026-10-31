'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createMarchingBubble, MarchingBubbleInstance } from './createMarchingBubble';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StepsStickyBubbleCanvasProps {
  onShopClick?: () => void;
}

export default function StepsStickyBubbleCanvas({ onShopClick }: StepsStickyBubbleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shopButtonRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stepsSection = document.querySelector<HTMLElement>('.steps');
    const expandElem = stepsSection?.querySelector<HTMLElement>('.steps__expand');
    const shopBtn = shopButtonRef.current;
    const stepBlocks = Array.from(document.querySelectorAll<HTMLElement>('.steps-block')).slice(0, 4);
    const lastStepBlock = stepBlocks[stepBlocks.length - 1];

    if (!stepsSection || !expandElem || !stepBlocks.length) return;

    const defaultScale = 0.84;
    const transitionCutoff = 0.22;

    const isMobile = () => window.innerWidth <= 1100;

    // Helper math functions matching authentic Stem Beauty engine
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
    const smoothQuint = (t: number) => t * t * t * (t * (6 * t - 15) + 10);

    const updateShopBtn = (progressVal: number) => {
      if (!shopBtn) return;
      const alpha = clamp((progressVal - 0.72) / 0.18, 0, 1);
      const translateY = lerp(20, 0, smoothQuint(alpha));
      shopBtn.style.opacity = `${alpha}`;
      shopBtn.style.transform = `translate(-50%, ${translateY}px)`;
      shopBtn.style.pointerEvents = alpha > 0.98 ? 'auto' : 'none';
    };

    const getTrajectoryCoords = () => {
      const aspect = (canvas.clientWidth || window.innerWidth) / (canvas.clientHeight || window.innerHeight || 1);
      return isMobile()
        ? [
            { x: 0, y: 0.52 },
            { x: 0, y: 0.18 },
            { x: 0, y: -0.08 },
            { x: 0, y: -0.25 },
            { x: 0, y: 0.03 },
          ]
        : [
            { x: -1.0 * aspect, y: 0.9 },
            { x: -0.5 * aspect, y: 0 },
            { x: -1.0 * aspect, y: -0.04 },
            { x: -0.5 * aspect, y: 0 },
            { x: 0, y: 0.03 },
          ];
    };

    // Instantiate Three.js MarchingCubes bubble
    const bubbleInstance: MarchingBubbleInstance = createMarchingBubble(
      canvas,
      {
        reveal: 1,
        collect: 1,
        alpha: 1,
        scale: isMobile() ? 1.45 : defaultScale,
        x: getTrajectoryCoords()[0].x,
        y: getTrajectoryCoords()[0].y,
        travel: 0,
        flowX: 0,
        flowY: 0,
        flowZ: 0,
        pulse: 0,
        rotateX: 0,
        rotateY: 0,
        imageScale: isMobile() ? 0.58 : undefined,
      },
      {
        desktopResolution: 108,
        mobileResolution: 68,
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
        imageOpacity: 0.85,
        imageOffsetX: isMobile() ? 0 : -0.07,
        imageScrub: 0.28,
        imageMaskRadius: 0.76,
        imageMaskSoftness: 0.2,
        imageRevealStart: 0,
        imageZ: -0.24,
        imageRotateYFactor: 0.04,
        imageRotateXFactor: 0.03,
      }
    );

    bubbleInstance.setImageTransition(0, 1, 0);

    const scrollTrigger = ScrollTrigger.create({
      trigger: stepsSection,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh() {
        const coords = getTrajectoryCoords();
        bubbleInstance.setState({
          x: coords[0].x,
          y: coords[0].y,
          travel: 0,
          flowX: 0,
          flowY: 0,
          flowZ: 0,
          pulse: 0,
          scale: isMobile() ? 1.45 : defaultScale,
          imageScale: isMobile() ? 0.58 : undefined,
          rotateX: 0,
          rotateY: 0,
        });
        updateShopBtn(0);
      },
      onUpdate() {
        const coords = getTrajectoryCoords();

        // Calculate active step fraction (0 to 3) based on block positions
        const stepProgress = (() => {
          const mobile = isMobile();
          const targetY = window.innerHeight * (mobile ? 0.5 : 0.45);
          const blockTops = stepBlocks.map((el) => {
            const rect = el.getBoundingClientRect();
            return mobile ? rect.top + 0.5 * rect.height : rect.top;
          });

          if (blockTops[0] >= targetY) return 0;
          if (blockTops[blockTops.length - 1] <= targetY) return blockTops.length - 1;

          for (let i = 0; i < blockTops.length - 1; i += 1) {
            if (blockTops[i + 1] >= targetY) {
              const diff = blockTops[i + 1] - blockTops[i];
              return diff <= 0 ? i + 1 : i + clamp((targetY - blockTops[i]) / diff, 0, 1);
            }
          }
          return blockTops.length - 1;
        })();

        // Calculate progress into .steps__expand towards final 4-products reveal
        const expandProgress = (() => {
          const mobile = isMobile();
          const threshold = window.innerHeight * (mobile ? 0.78 : 0.82);
          const lastRect = lastStepBlock.getBoundingClientRect();
          const lastPos = mobile ? lastRect.top + 0.5 * lastRect.height : lastRect.bottom;
          const expandRect = expandElem.getBoundingClientRect();
          const raw = clamp(
            (threshold - lastPos) / Math.max(expandRect.height, window.innerHeight * (mobile ? 0.92 : 0.58), 1),
            0,
            1
          );
          return lastPos >= threshold ? 0 : expandRect.bottom <= threshold ? 1 : clamp((raw - transitionCutoff) / 0.78, 0, 1);
        })();

        const composite = expandProgress > 0 ? 3 + expandProgress : stepProgress;
        const segmentIdx = clamp(Math.floor(composite), 0, coords.length - 2);
        const segmentFract = clamp(composite - segmentIdx, 0, 1);
        const smoothProgress = smoothQuint(segmentFract);

        const ptA = coords[segmentIdx];
        const ptB = coords[segmentIdx + 1];
        const curX = lerp(ptA.x, ptB.x, smoothProgress);
        const curY = lerp(ptA.y, ptB.y, smoothProgress);

        const sineWave = Math.sin(smoothProgress * Math.PI);
        const isFinalPhase = segmentIdx === coords.length - 2;

        const easeFinal = smoothQuint(clamp((smoothProgress - 0.2) / 0.75, 0, 1));
        const velocityMultiplier = isFinalPhase ? lerp(1.24, 2.1, smoothQuint(clamp((smoothProgress - 0.03) / 0.44, 0, 1))) : 1;
        const baseScale = isMobile() ? 1.45 : defaultScale;
        const targetScale = isFinalPhase ? lerp(baseScale, 2.05, smoothQuint(clamp((smoothProgress - 0.01) / 0.99, 0, 1))) : baseScale;
        const pulseEffect = isFinalPhase ? 0.06 * sineWave + 0.035 * smoothQuint(clamp((smoothProgress - 0.68) / 0.22, 0, 1)) : 0.035 * sineWave;
        const rotY = isFinalPhase ? lerp(0, 2.18 * Math.PI, easeFinal) : 0;
        const rotX = isFinalPhase ? lerp(0, -0.18, easeFinal) : 0;

        // Dynamic fluid elongation & velocity displacement
        const flowX = (ptB.x - ptA.x) * sineWave * 1.15 * velocityMultiplier;
        const flowY = (ptB.y - ptA.y) * sineWave * 1.15 * velocityMultiplier;
        const rotPhase = isFinalPhase ? smoothQuint(clamp((smoothProgress - 0.02) / 2, 0, 1)) : 0;
        const flowZ = isFinalPhase ? 1.85 * Math.sin(smoothProgress * Math.PI * 2) * velocityMultiplier * rotPhase : 0;

        bubbleInstance.setState({
          x: curX,
          y: curY,
          travel: smoothProgress,
          flowX,
          flowY,
          flowZ,
          pulse: pulseEffect,
          scale: targetScale,
          rotateX: rotX,
          rotateY: rotY,
          imageScale: isMobile() ? 0.58 : undefined,
        });

        if (isFinalPhase) {
          const normProg = clamp(expandProgress / Math.max(0.78, 0.01), 0, 1);
          const fadeProg = smoothQuint(clamp((normProg - 0.32) / 0.24, 0, 1));
          if (normProg < 0.12) {
            bubbleInstance.setImageTransition(3, 3, 0);
            updateShopBtn(0);
          } else {
            bubbleInstance.setImageTransition(3, 4, fadeProg);
            updateShopBtn(smoothProgress);
          }
          return;
        }

        const activeImg = segmentFract > 0.5 ? clamp(segmentIdx + 1, 0, 3) : segmentIdx;
        bubbleInstance.setImageTransition(activeImg, activeImg, 0);
        updateShopBtn(0);
      },
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scrollTrigger.kill();
      bubbleInstance.destroy();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        id="sphere-canvas-2"
        className="steps__sphere-canvas w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Authentic Stem Beauty "SHOP" Button */}
      <a
        ref={shopButtonRef}
        href="#collection"
        onClick={(e) => {
          if (onShopClick) {
            e.preventDefault();
            onShopClick();
          }
        }}
        className="steps__shop absolute bottom-[100px] md:bottom-[140px] left-1/2 -translate-x-1/2 inline-flex items-center justify-center px-10 py-3 bg-white border border-[#331b0f] text-[#331b0f] hover:bg-[#331b0f] hover:text-white transition-all duration-300 font-metropolis text-sm uppercase tracking-[0.08em] shadow-md z-30 pointer-events-none opacity-0"
      >
        <span>SHOP</span>
      </a>
    </div>
  );
}
