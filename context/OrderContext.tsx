"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { WizardState } from "./CartContext";

interface OrderContextType {
  order: WizardState;
  setOrder: React.Dispatch<React.SetStateAction<WizardState>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  resetOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const INITIAL_ORDER: WizardState = {
  category: "",
  occasion: "",
  style: "",
  extras: [],
  specialRequest: "",
  budget: "",
  message: "",
  date: "",
  slot: "",
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<WizardState>(INITIAL_ORDER);
  const [step, setStep] = useState(1);

  const resetOrder = () => {
    setOrder(INITIAL_ORDER);
    setStep(1);
  };

  return (
    <OrderContext.Provider value={{ order, setOrder, step, setStep, resetOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
