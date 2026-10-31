'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  speedY: number;
  speedX: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobbleOffset: number;
  opacity: number;
  hueShift: number;
  isPopping: boolean;
  popProgress: number;
  particles?: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[];
}

export default function AmbientFloatingBubbles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bubbleCount, setBubbleCount] = useState(16);
  const [isInteractive, setIsInteractive] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const bubblesRef = useRef<Bubble[]>([]);

  // Check reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const createBubble = useCallback((width: number, height: number, initialY?: number): Bubble => {
    const baseRadius = Math.random() * 42 + 22; // 22px to 64px
    return {
      x: Math.random() * width,
      y: initialY !== undefined ? initialY : height + baseRadius + Math.random() * 100,
      radius: baseRadius,
      baseRadius,
      speedY: -(Math.random() * 0.45 + 0.35),
      speedX: (Math.random() - 0.5) * 0.3,
      wobbleSpeed: Math.random() * 0.02 + 0.015,
      wobbleAmp: Math.random() * 4 + 2,
      wobbleOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.4 + 0.55,
      hueShift: Math.random() * 360,
      isPopping: false,
      popProgress: 0,
    };
  }, []);

  const initBubbles = useCallback((width: number, height: number) => {
    const list: Bubble[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      // Distribute vertically across page initially
      const y = Math.random() * height;
      list.push(createBubble(width, height, y));
    }
    bubblesRef.current = list;
  }, [bubbleCount, createBubble]);

  const popBubble = (bubble: Bubble) => {
    if (bubble.isPopping) return;
    bubble.isPopping = true;
    bubble.popProgress = 0;
    // Generate burst micro-droplets
    const particleCount = 10;
    bubble.particles = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 / particleCount) * i + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 2.5 + 1.5;
      bubble.particles.push({
        x: bubble.x,
        y: bubble.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 0.9,
        size: Math.random() * 2.5 + 1,
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initBubbles(width, height);
    };

    window.addEventListener('resize', handleResize);
    initBubbles(width, height);

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const bubbles = bubblesRef.current;

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];

        if (b.isPopping) {
          // Render popping burst particles
          if (b.particles) {
            for (const p of b.particles) {
              p.x += p.vx;
              p.y += p.vy;
              p.alpha -= 0.04;
              if (p.alpha > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.fill();
                ctx.restore();
              }
            }
          }
          b.popProgress += 0.05;
          if (b.popProgress >= 1) {
            // Respawn bubble at bottom
            bubbles[i] = createBubble(width, height);
          }
          continue;
        }

        // Float movement
        if (!reducedMotion) {
          b.y += b.speedY;
          b.x += b.speedX + Math.sin(time * b.wobbleSpeed * 60 + b.wobbleOffset) * 0.4;
        }

        // Mouse interaction (repel gently)
        if (mouse.active && isInteractive) {
          const dx = b.x - mouse.x;
          const dy = b.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = b.radius + 70;
          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 3;
            b.x += (dx / dist) * force;
            b.y += (dy / dist) * force;
          }
        }

        // Screen boundaries
        if (b.y < -b.radius * 2) {
          bubbles[i] = createBubble(width, height);
          continue;
        }
        if (b.x < -b.radius) b.x = width + b.radius;
        if (b.x > width + b.radius) b.x = -b.radius;

        // Render Realistic Iridescent Bubble
        ctx.save();
        ctx.translate(b.x, b.y);

        // Bubble body clip & path
        ctx.beginPath();
        const wobbleX = Math.sin(time * 2 + b.wobbleOffset) * b.wobbleAmp;
        const wobbleY = Math.cos(time * 2 + b.wobbleOffset) * b.wobbleAmp;
        ctx.ellipse(0, 0, Math.max(10, b.radius + wobbleX), Math.max(10, b.radius - wobbleY), 0, 0, Math.PI * 2);

        // 1. Subtle inner refractive gradient
        const innerGrad = ctx.createRadialGradient(
          -b.radius * 0.3,
          -b.radius * 0.3,
          b.radius * 0.05,
          0,
          0,
          b.radius
        );
        innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        innerGrad.addColorStop(0.5, 'rgba(240, 245, 255, 0.05)');
        innerGrad.addColorStop(0.85, 'rgba(215, 225, 245, 0.12)');
        innerGrad.addColorStop(1, 'rgba(255, 255, 255, 0.35)');

        ctx.fillStyle = innerGrad;
        ctx.fill();

        // 2. Iridescent rim color interference (cyan, rose, amber, violet)
        ctx.lineWidth = 1.8;
        const rimGrad = ctx.createLinearGradient(-b.radius, -b.radius, b.radius, b.radius);
        rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        rimGrad.addColorStop(0.25, 'rgba(180, 230, 255, 0.65)'); // soft cyan
        rimGrad.addColorStop(0.5, 'rgba(255, 200, 230, 0.55)');  // soft pink
        rimGrad.addColorStop(0.75, 'rgba(235, 220, 180, 0.6)');  // warm amber
        rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0.8)');

        ctx.strokeStyle = rimGrad;
        ctx.stroke();

        // 3. Primary Top-Left Specular Glint
        ctx.beginPath();
        ctx.ellipse(
          -b.radius * 0.38,
          -b.radius * 0.38,
          b.radius * 0.28,
          b.radius * 0.14,
          Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();

        // 4. Secondary micro glint
        ctx.beginPath();
        ctx.arc(-b.radius * 0.55, -b.radius * 0.2, b.radius * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();

        // 5. Bottom bounce crescent reflection
        ctx.beginPath();
        ctx.ellipse(
          b.radius * 0.35,
          b.radius * 0.35,
          b.radius * 0.22,
          b.radius * 0.08,
          Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 235, 245, 0.45)';
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onPointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    const onClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      for (const b of bubblesRef.current) {
        if (!b.isPopping) {
          const dist = Math.hypot(b.x - clickX, b.y - clickY);
          if (dist < b.radius + 15) {
            popBubble(b);
            break;
          }
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('click', onClick);
    };
  }, [initBubbles, createBubble, isInteractive, reducedMotion]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-30"
        aria-hidden="true"
      />

      {/* Floating Bubble Control Pill (Bottom-left subtle interactive widget) */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 bg-[#EDE8E1]/85 backdrop-blur-md border border-black/10 px-3.5 py-2 rounded-full shadow-sm text-xs font-metropolis">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-stem-muted font-medium">Bubbles:</span>
        <button
          onClick={() => {
            const next = bubbleCount === 16 ? 26 : bubbleCount === 26 ? 8 : 16;
            setBubbleCount(next);
          }}
          className="text-stem-dark hover:text-black font-semibold uppercase text-[10px] tracking-wider bg-black/5 hover:bg-black/10 px-2 py-0.5 rounded transition-colors"
          title="Toggle bubble density"
        >
          {bubbleCount} active
        </button>
        <button
          onClick={() => setIsInteractive(!isInteractive)}
          className={`text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded transition-colors ${
            isInteractive ? 'bg-stem-dark text-white' : 'bg-black/5 text-stem-muted'
          }`}
          title="Toggle interactive mouse repulsion & click to pop"
        >
          {isInteractive ? 'Interactive' : 'Passive'}
        </button>
      </div>
    </>
  );
}

