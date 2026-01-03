"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Alert, { AlertType } from "@/components/Alert";

export default function CityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [city, setCity] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertState, setAlertState] = useState<{ message: string; type: AlertType } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch City
      const { data: cityData } = await supabase.from("cities").select("*").eq("id", params.id).single();
      setCity(cityData);

      // 2. Fetch Categories (Products only)
      const { data: catData } = await supabase.from("categories").select("*").eq("type", "product").order("display_order");
      setCategories(catData || []);

      // 3. Fetch Budgets for this city
      const { data: budgetData } = await supabase.from("budgets").select("*").eq("city_id", params.id);
      setBudgets(budgetData || []);

      setLoading(false);
    }
    fetchData();
  }, [params.id, supabase]);

  const handlePriceChange = (budgetId: string, newPrice: string) => {
    setBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, price: parseFloat(newPrice) } : b));
  };

  const saveChanges = async () => {
    setSaving(true);
    // Update all budgets
    const updates = budgets.map(b => ({
        id: b.id,
        price: b.price
    }));

    const { error } = await supabase.from("budgets").upsert(updates);
    
    if (error) {
        setAlertState({ message: "Erreur lors de la sauvegarde : " + error.message, type: "error" });
    } else {
        setAlertState({ message: "Prix mis à jour avec succès !", type: "success" });
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center font-serif text-stone-400">Chargement...</div>;
  if (!city) return <div className="p-10 text-center text-red-500 font-serif">Ville introuvable.</div>;

  return (
    <div className="pb-20">
      {alertState && <Alert message={alertState.message} type={alertState.type} onClose={() => setAlertState(null)} />}
      <div className="flex items-center justify-between mb-8">
        <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-stone-500 hover:text-black text-sm font-medium transition-colors"
        >
            <ArrowLeft size={16} /> Retour
        </button>
        <button 
            onClick={saveChanges}
            disabled={saving}
            className="px-6 py-3 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-stone-800 transition shadow-lg disabled:opacity-70"
        >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Enregistrer les changements
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">{city.name}</h1>
        <p className="text-stone-500 text-sm">Gestion des tarifs pour cette zone géographique.</p>
      </div>

      <div className="space-y-8">
        {categories.map(cat => {
            const catBudgets = budgets.filter(b => b.category_id === cat.id).sort((a, b) => a.display_order - b.display_order);
            if (catBudgets.length === 0) return null;

            return (
                <div key={cat.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center">
                        <h3 className="font-serif text-lg font-bold">{cat.title}</h3>
                        <span className="text-[10px] uppercase tracking-widest text-stone-400">{cat.slug}</span>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {catBudgets.map(budget => (
                            <div key={budget.id} className="flex items-center justify-between p-4 border border-stone-100 rounded-lg hover:border-stone-300 transition">
                                <span className="font-medium text-stone-700">{budget.label}</span>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        value={budget.price} 
                                        onChange={(e) => handlePriceChange(budget.id, e.target.value)}
                                        className="w-24 p-2 text-right border border-stone-300 rounded focus:border-black outline-none font-bold"
                                    />
                                    <span className="text-sm text-stone-400">{city.currency_symbol}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}
