'use client';

import React from 'react';
import Image from 'next/image';
import { PRODUCTS_DATA, Product } from '@/models/Product';
import { useCart } from '@/context/CartContext';

export default function CollectionSection() {
  const { addToCart } = useCart();

  return (
    <section id="collection" className="collection relative py-24 md:py-36 overflow-hidden bg-white">
      {/* Background Graphic */}
      <div className="absolute bottom-[20%] -left-[20%] w-[120%] h-[80%] pointer-events-none opacity-40 -rotate-[15deg]">
        <Image
          src="/assets/bg2.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-[1720px] mx-auto px-6 md:px-12 relative z-10">
        {/* Section Title matching Stem Beauty */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="title inline-block font-metropolis uppercase text-xl md:text-2xl text-[#d08c81] tracking-[0.15em] pl-6 relative">
            The collection
          </h2>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {PRODUCTS_DATA.map((product: Product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="card group cursor-pointer flex flex-col items-center text-center"
            >
              {/* Product Card Image with Dual Image Crossfade */}
              <div className="card__img relative w-full aspect-[4/5] overflow-hidden bg-[#F6F4F0] rounded-none mb-6">
                {/* Primary Image */}
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-center transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-110"
                />

                {/* Secondary Image */}
                <Image
                  src={product.images[1]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-center absolute inset-0 opacity-0 scale-110 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
                />

                {/* Select Button on Hover */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[85%] z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <span className="button block w-full py-2.5 px-6 border border-[#331b0f] text-[#202020] bg-white/90 backdrop-blur-sm hover:bg-[#331b0f] hover:text-white text-xs uppercase tracking-widest font-medium transition-all text-center">
                    select
                  </span>
                </div>
              </div>

              {/* Title with Split Text Animation */}
              <h3 className="font-metropolis text-lg sm:text-xl font-medium uppercase text-[#202020] tracking-normal mb-2 overflow-hidden h-[1.3em]">
                <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                  {product.name}
                </span>
                <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full text-[#d08c81]">
                  {product.name}
                </span>
              </h3>

              {/* Price */}
              <span className="font-metropolis text-base text-[#202020] font-normal tracking-wide">
                ${product.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
