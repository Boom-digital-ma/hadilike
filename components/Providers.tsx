"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const paypalOptions = {
  clientId: "test", 
  currency: "EUR", 
  intent: "capture",
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <CartProvider>
        <OrderProvider>
          {children}
        </OrderProvider>
      </CartProvider>
    </PayPalScriptProvider>
  );
}
