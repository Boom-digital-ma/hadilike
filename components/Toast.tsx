"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: "bg-stone-900 text-white",
    error: "bg-red-500 text-white",
    info: "bg-white text-black border border-stone-200"
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-white" />,
    info: <CheckCircle className="w-5 h-5 text-stone-900" />
  };

  return (
    <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-full shadow-xl transition-all duration-500 animate-in slide-in-from-top-5 fade-in ${bgColors[type]}`}>
      {icons[type]}
      <span className="text-sm font-medium tracking-wide">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
