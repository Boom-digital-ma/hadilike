"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type WizardState = {
  id?: string;
  category: string;
  occasion: string;
  style: string;
  extras?: string[];
  specialRequest?: string;
  budget: string;
  message: string;
  date: string;
  slot: string;
};

interface CartContextType {
  cart: WizardState[];
  addToCart: (item: WizardState) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<WizardState[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: WizardState) => {
    setCart((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const clearCart = () => setCart([]);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
