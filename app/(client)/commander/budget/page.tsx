"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { useBrand } from "@/context/BrandContext";
import { useState, useEffect } from "react";
import { getBudgets } from "@/lib/api";

export default function BudgetPage() {
  const router = useRouter();
  const { order, setOrder } = useOrder();
  const { brand, currentCity, categories } = useBrand();
  
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const config = categories.find((c) => c.title === order.category);

  useEffect(() => {
    if (brand && currentCity && config) {
      getBudgets(brand.id, currentCity.id, config.id).then(data => {
        setBudgets(data);
        setLoading(false);
      });
    } else if (categories.length > 0 && !config) {
        setLoading(false);
    }
  }, [brand, currentCity, config, categories]);

  const handleBudgetSelect = (budget: any) => {
    setOrder(prev => ({ ...prev, budget: `${budget.price} ${currentCity?.currency_symbol || 'DH'}` }));
    router.push("/commander/details");
  };

  if (loading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center font-serif">Chargement...</div>;

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto">
      <button onClick={() => router.back()} className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </button>

      <h3 className="font-serif text-2xl mb-8">Choisissez votre Budget</h3>

      <div className="space-y-4">
        {budgets.length === 0 && !loading && (
            <div className="text-center py-10 bg-stone-50 rounded-lg">
                <p className="text-stone-500">Aucun budget disponible pour cette catégorie ({order.category}).</p>
                <p className="text-xs text-stone-400 mt-2">Veuillez contacter le support.</p>
            </div>
        )}
        {budgets.map((b) => (
          <button
            key={b.id}
            onClick={() => handleBudgetSelect(b)}
            className="w-full group flex items-center justify-between p-6 bg-white border border-stone-200 rounded-lg shadow-sm hover:border-black transition-all duration-300"
          >
            <div>
              <p className="text-stone-400 text-[10px] uppercase tracking-widest mb-1">{b.label}</p>
              <p className="text-stone-800 font-serif text-2xl tracking-wide">{b.price} <span className="text-sm">{currentCity?.currency_symbol || 'DH'}</span></p>
            </div>
            <div className="w-8 h-8 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <span className="text-lg">→</span>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-stone-400 leading-relaxed italic">
        "Le prix varie selon la rareté et la saisonnalité des fleurs sélectionnées par notre artisan."
      </p>
    </div>
  );
}
