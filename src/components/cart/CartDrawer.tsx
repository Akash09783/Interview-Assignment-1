'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  const freeShippingThreshold = 75;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#EDE8E1] shadow-2xl flex flex-col justify-between border-l border-black/10">
          {/* Header */}
          <div className="p-6 border-b border-black/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-stem-dark" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">
                Shopping Cart ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full hover:bg-black/5 transition-colors text-stem-dark"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3 bg-[#E3DDD4] border-b border-black/5 text-xs">
            {remainingForFreeShipping === 0 ? (
              <p className="text-emerald-800 font-medium">
                ✨ You’ve unlocked <strong>Free Standard Shipping</strong>!
              </p>
            ) : (
              <p className="text-stem-dark">
                Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more for free standard shipping
              </p>
            )}
            <div className="w-full h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-stem-rose transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4 text-stem-muted">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-degular text-2xl font-normal text-stem-dark mb-2">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stem-muted max-w-xs mb-6 font-metropolis">
                  Discover Stem Beauty’s bio-cellular skincare designed for ultimate skin fitness.
                </p>
                <button
                  onClick={closeCart}
                  className="btn-stem"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 pb-6 border-b border-black/5 items-start"
                >
                  <div className="relative w-20 h-24 bg-[#E3DDD4] rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-degular text-lg font-medium text-stem-dark leading-tight">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stem-muted hover:text-black transition-colors text-xs p-1"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-stem-muted mt-1 font-mono">
                      ${item.product.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center border border-black/20 rounded-full bg-white/40 px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:opacity-60 transition-opacity"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:opacity-60 transition-opacity"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-mono font-semibold ml-auto">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-black/10 bg-[#E6E0D7]/60 space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="uppercase tracking-wider text-xs text-stem-muted">
                  Subtotal
                </span>
                <span className="font-mono text-base font-semibold">
                  ${subtotal.toFixed(2)} USD
                </span>
              </div>
              <p className="text-[11px] text-stem-muted">
                Taxes and shipping calculated at checkout.
              </p>
              <button
                onClick={() => alert('Proceeding to checkout with Stem Beauty...')}
                className="w-full btn-stem-fill flex items-center justify-center gap-3 py-3.5 shadow-md"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

