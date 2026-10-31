'use client';

import React from 'react';
import Image from 'next/image';
import { PRODUCTS_DATA, Product } from '@/models/Product';
import { useCart } from '@/context/CartContext';
import { Plus } from 'lucide-react';

export default function CollectionSection() {
  const { addToCart } = useCart();

  return (
    <section id="collection" className="relative py-28 md:py-36 bg-[#EDE8E1] overflow-hidden">
      {/* Subtle organic background curve */}
      <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-25">
        <Image
          src="/assets/bg2.png"
          alt=""
          fill
          className="object-cover object-right"
        />
      </div>

      <div className="max-w-[1720px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stem-muted font-medium mb-3">
              Formulated with PDRN Salmon DNA
            </p>
            <h2 className="font-degular text-4xl sm:text-5xl md:text-6xl font-normal text-stem-dark tracking-tight">
              The collection
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-stem-muted font-metropolis leading-relaxed">
            Four targeted formulas engineered to mimic natural cellular recovery cycles, delivering
            deep hydration, barrier reinforcement, and youthful skin elasticity.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {PRODUCTS_DATA.map((product: Product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between"
            >
              {/* Image Container with Dual Image Hover */}
              <div className="relative w-full aspect-[4/5] bg-[#E3DDD4] rounded-lg overflow-hidden mb-6 card-image-box shadow-sm">
                {/* Primary Image */}
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="primary-img object-cover object-center"
                />

                {/* Secondary Hover Image */}
                <Image
                  src={product.images[1] || product.images[0]}
                  alt={`${product.name} alternate view`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="hover-img object-cover object-center absolute inset-0 opacity-0"
                />

                {/* Step badge */}
                {product.step && (
                  <span className="absolute top-4 left-4 text-[10px] uppercase font-mono tracking-widest bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full">
                    Step {product.step}: {product.stepName}
                  </span>
                )}

                {/* Quick Add Overlay Button */}
                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-4 left-4 right-4 py-3 bg-white/90 backdrop-blur-md hover:bg-stem-dark hover:text-white text-stem-dark text-xs uppercase tracking-[0.14em] font-semibold rounded-full transition-all duration-300 opacity-90 group-hover:opacity-100 flex items-center justify-center gap-2 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Select &bull; ${product.price.toFixed(2)}</span>
                </button>
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-degular text-xl sm:text-2xl font-normal text-stem-dark group-hover:text-stem-rose transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-mono text-sm font-semibold text-stem-dark ml-2">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-stem-muted line-clamp-2 mb-3 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stem-muted/80 font-mono pt-2 border-t border-black/5">
                  <span>{product.volume}</span>
                  <span>&bull;</span>
                  <span>{product.keyIngredients[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
