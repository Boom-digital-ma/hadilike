"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { BrandProvider } from "@/context/BrandContext";

const paypalOptions = {
  clientId: "test", 
  currency: "EUR", 
  intent: "capture",
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BrandProvider>
      <PayPalScriptProvider options={paypalOptions}>
        <CartProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </CartProvider>
      </PayPalScriptProvider>
    </BrandProvider>
  );
}
