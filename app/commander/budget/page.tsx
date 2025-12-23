"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SHOP_CONFIG } from "@/data/shop-config";
import { useOrder } from "@/context/OrderContext";

export default function BudgetPage() {
  const router = useRouter();
  const { order, setOrder } = useOrder();

  const config = SHOP_CONFIG.find((c) => c.id === order.category);

  // If no category in context, redirect home
  if (!config) {
    if (typeof window !== "undefined") router.push("/");
    return null; 
  }

  const handleBudgetSelect = (price: string) => {
    setOrder(prev => ({ ...prev, budget: price }));
    router.push("/commander/details");
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <button onClick={() => router.back()} className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </button>

      <h3 className="font-serif text-2xl mb-6">Votre Budget</h3>
      <div className="space-y-3">
        {config.budgets?.map((opt) => (
            <button
                key={opt.price}
                onClick={() => handleBudgetSelect(opt.price)}
                className="w-full p-4 border border-stone-300 rounded flex justify-between hover:border-black hover:bg-stone-50 transition"
            >
                <span>{opt.label}</span>
                <span className="font-bold">{opt.price}</span>
            </button>
        ))}
      </div>
    </div>
  );
}
