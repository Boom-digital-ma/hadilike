"use client";

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export type AlertType = "success" | "error" | "info" | "warning";

interface AlertProps {
  message: string;
  type: AlertType;
  onClose?: () => void;
  autoClose?: number;
}

export default function Alert({ message, type, onClose, autoClose = 4000 }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) setTimeout(onClose, 300); // Wait for fade-out animation
  };

  if (!isVisible) return null;

  const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  };

  return (
    <div 
      className={`fixed top-10 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-lg px-6 py-4 rounded-xl border flex items-center gap-4 shadow-2xl animate-in slide-in-from-top-10 duration-300 ${styles[type]}`}
    >
      <div className="shrink-0">{icons[type]}</div>
      <div className="flex-1 text-sm font-bold tracking-tight">{message}</div>
      <button 
        onClick={handleClose} 
        className="p-1.5 hover:bg-black/5 rounded-lg transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}