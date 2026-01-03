"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Plus, Edit, MapPin, X, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CitiesPage() {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [creating, setCreating] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchCities();
  }, [supabase]);

  async function fetchCities() {
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .order("name");

    if (error) console.error(error);
    else setCities(data || []);
    setLoading(false);
  }

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName) return;
    setCreating(true);

    try {
        // 1. Get the brand ID (assuming single brand context for now or fetch first brand)
        // For SAAS, we should get the current user's brand. Here we pick the first one from cities or hardcode logic.
        // Let's fetch the first brand ID available if cities exist, else fetch brands.
        let brandId = cities.length > 0 ? cities[0].brand_id : null;
        
        if (!brandId) {
            const { data: brandData } = await supabase.from("brands").select("id").limit(1).single();
            if (brandData) brandId = brandData.id;
        }

        if (!brandId) throw new Error("Aucune marque trouvée.");

        const slug = newCityName.toLowerCase().replace(/ /g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // 2. Insert City
        const { data: cityData, error: cityError } = await supabase
            .from("cities")
            .insert({
                brand_id: brandId,
                name: newCityName,
                slug: slug,
                config: { delivery_fee: 50, min_delay_hours: 24 }
            })
            .select()
            .single();

        if (cityError) throw cityError;

        // 3. Seed Default Budgets (Copy from Marrakech or default logic)
        // Let's fetch categories
        const { data: categories } = await supabase.from("categories").select("*").eq("type", "product");
        
        if (categories) {
            const budgetsToInsert: any[] = [];
            
            categories.forEach(cat => {
                // Default budgets structure
                const defaults = [
                    { label: "Le Petit Geste", price: 400 },
                    { label: "Le Plaisir", price: 600 },
                    { label: "L'Exception", price: 900 },
                    { label: "La Folie", price: 1500 }
                ];

                defaults.forEach((def, idx) => {
                    budgetsToInsert.push({
                        brand_id: brandId,
                        city_id: cityData.id,
                        category_id: cat.id,
                        label: def.label,
                        price: def.price,
                        display_order: idx + 1
                    });
                });
            });

            if (budgetsToInsert.length > 0) {
                await supabase.from("budgets").insert(budgetsToInsert);
            }
        }

        setIsModalOpen(false);
        setNewCityName("");
        fetchCities(); // Refresh list

    } catch (err: any) {
        alert("Erreur lors de la création : " + err.message);
    } finally {
        setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-3xl">Villes & Zones</h2>
          <p className="text-stone-500 text-sm">Gérez les zones de livraison et leurs tarifs.</p>
        </div>
        <button 
            className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-stone-800 transition shadow-md"
            onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Nouvelle Ville
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
            <div className="col-span-3 text-center py-10 text-stone-400 font-serif">Chargement...</div>
        ) : (
            cities.map((city) => (
                <div key={city.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-600">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-bold">{city.name}</h3>
                                <p className="text-xs text-stone-400 uppercase tracking-wider">{city.is_active ? "Active" : "Inacive"}</p>
                            </div>
                        </div>
                        <Link href={`/admin/cities/${city.id}`}>
                            <button className="p-2 text-stone-400 hover:text-black hover:bg-stone-50 rounded-full transition">
                                <Edit size={16} />
                            </button>
                        </Link>
                    </div>
                    
                    <div className="space-y-2 text-sm text-stone-600 mb-6">
                        <p className="flex justify-between">
                            <span>Devise</span>
                            <span className="font-bold">{city.currency_symbol}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Livraison</span>
                            <span className="font-bold">{city.config?.delivery_fee || 0} {city.currency_symbol}</span>
                        </p>
                    </div>

                    <Link href={`/admin/cities/${city.id}`}>
                        <button className="w-full py-3 border border-stone-200 rounded-lg text-sm font-medium hover:bg-black hover:text-white transition-colors">
                            Gérer les Prix
                        </button>
                    </Link>
                </div>
            ))
        )}
      </div>

      {/* Modal Création */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl font-bold">Ajouter une ville</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-black">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleCreateCity} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Nom de la ville</label>
                        <input 
                            type="text" 
                            placeholder="ex: Casablanca"
                            className="w-full p-3 border border-stone-300 rounded-lg focus:border-black outline-none"
                            value={newCityName}
                            onChange={(e) => setNewCityName(e.target.value)}
                            autoFocus
                        />
                        <p className="text-[10px] text-stone-400 mt-2">
                            Cela créera automatiquement les grilles tarifaires par défaut pour cette ville.
                        </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-3 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit"
                            disabled={creating || !newCityName}
                            className="flex-1 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {creating && <Loader2 className="animate-spin" size={16} />}
                            Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}