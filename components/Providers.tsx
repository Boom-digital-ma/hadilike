"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { BrandProvider } from "@/context/BrandContext";
import { DynamicPayPalProvider } from "@/components/DynamicPayPalProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BrandProvider>
      <DynamicPayPalProvider>
        <CartProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </CartProvider>
      </DynamicPayPalProvider>
    </BrandProvider>
  );
}
