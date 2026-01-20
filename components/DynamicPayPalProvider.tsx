"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useBrand } from "@/context/BrandContext";
import { ReactNode } from "react";

export function DynamicPayPalProvider({ children }: { children: ReactNode }) {
  const { settings, isLoading } = useBrand();

  const paypalConfig = settings?.paypal_config?.value || {};
  
  // Default to sandbox/test if no client_id is provided in settings
  const clientId = paypalConfig.client_id || "test"; 
  const currency = paypalConfig.currency || "EUR";

  const initialOptions = {
    clientId,
    currency,
    intent: "capture",
  };

  if (isLoading) {
      // While brand is loading, we can just render children or a loader.
      // Rendering children ensures the app structure is present, but PayPal buttons might not appear yet.
      // However, usually PayPal buttons are deep in the tree and won't render until data is ready anyway.
      return <>{children}</>;
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
