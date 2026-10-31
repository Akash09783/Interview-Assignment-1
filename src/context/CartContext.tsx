'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/models/Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load initial cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stem_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('stem_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

