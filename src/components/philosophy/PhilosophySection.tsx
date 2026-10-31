'use client';

import React from 'react';
import Image from 'next/image';
import PhilosophyBubbleCanvas from '@/components/bubbles/PhilosophyBubbleCanvas';

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="relative py-24 md:py-36 bg-[#EDE8E1] overflow-hidden">
      {/* Background Graphic Overlays */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-30">
        <Image
          src="/assets/bg1.png"
          alt=""
          fill
          className="object-cover object-top"
        />
      </div>
      <div className="absolute bottom-0 right-0 w-full h-1/2 pointer-events-none -z-10 opacity-20">
        <Image
          src="/assets/bg2.png"
          alt=""
          fill
          className="object-cover object-bottom"
        />
      </div>

      <div className="max-w-[1720px] mx-auto px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.22em] text-stem-muted font-medium mb-3 font-metropolis">
            Our Philosophy
          </p>
          <h2 className="font-degular text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-stem-dark leading-[1.05] tracking-tight">
            Our products are designed as Skin Fitness Tools
          </h2>
          <p className="mt-6 text-xs sm:text-sm md:text-base text-stem-muted font-metropolis leading-relaxed max-w-xl mx-auto">
            Skin is an adaptive living organ. By fusing purified salmon DNA (PDRN) with bio-identical
            growth peptides, Stem Beauty trains the skin barrier to withstand daily environmental stressors.
          </p>
        </div>

        {/* 3D Interactive Marching Cubes Bubble Simulation */}
        <div className="w-full">
          <PhilosophyBubbleCanvas />
        </div>

        {/* Supporting Narrative */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-black/10 text-center md:text-left">
          <div>
            <h3 className="font-degular text-2xl text-stem-dark mb-2">Cellular Endurance</h3>
            <p className="text-xs text-stem-muted leading-relaxed">
              Stimulates intracellular micro-circulation and reinforces natural epidermal cohesion
              for all skin types.
            </p>
          </div>
          <div>
            <h3 className="font-degular text-2xl text-stem-dark mb-2">Targeted Recovery</h3>
            <p className="text-xs text-stem-muted leading-relaxed">
              Accelerates repair kinetics after oxidative stress, UV exposure, and environmental
              pollutants.
            </p>
          </div>
          <div>
            <h3 className="font-degular text-2xl text-stem-dark mb-2">Barrier Resilience</h3>
            <p className="text-xs text-stem-muted leading-relaxed">
              Reinforces multi-lamellar lipid matrices to lock in high-molecular hydration without
              pore clogging.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

