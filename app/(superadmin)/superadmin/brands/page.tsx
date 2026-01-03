"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Plus, Globe, Settings, ShieldCheck, ExternalLink, Loader2, X } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SuperAdminBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", domain: "", slug: "" });
  const [submitting, setSubmitting] = useState(false);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    fetchBrands();
  }, [supabase]);

  async function fetchBrands() {
    setLoading(true);
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("name");

    if (error) console.error(error);
    else setBrands(data || []);
    setLoading(false);
  }

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.name || !newBrand.slug) return;
    setSubmitting(true);

    try {
        // 1. Insert Brand
        const { data: brandData, error: brandError } = await supabase
            .from("brands")
            .insert({
                name: newBrand.name,
                slug: newBrand.slug,
                domain: newBrand.domain || null,
                theme_config: {
                    logo_url: "/images/logo-new.jpeg",
                    colors: { primary: "#000000", secondary: "#ffffff", accent: "#f4d03f" },
                    fonts: { heading: "Urbanist", body: "Manrope" }
                }
            })
            .select()
            .single();

        if (brandError) throw brandError;

        // 2. Seed Default Categories
        const defaultCats = [
            { slug: 'boites-a-fleurs', title: 'Boîtes à fleurs', type: 'product', flow: 'wizard', order: 1 },
            { slug: 'bouquets', title: 'Bouquets', type: 'product', flow: 'wizard', order: 2 },
            { slug: 'composition-speciale', title: 'Composition Spéciale', type: 'product', flow: 'direct', order: 3 },
            { slug: 'evenements', title: 'Wedding', type: 'service', flow: 'contact', order: 4 },
            { slug: 'decoration', title: 'Art floral', type: 'service', flow: 'contact', order: 5 },
        ];

        const catsToInsert = defaultCats.map(c => ({
            brand_id: brandData.id,
            slug: c.slug,
            title: c.title,
            type: c.type,
            flow: c.flow,
            display_order: c.order,
            cover_image: "/images/composition.jpeg"
        }));

        await supabase.from("categories").insert(catsToInsert);

        // 3. Seed Default Settings
        const defaultSettings = [
            { key: 'promo_popup', value: { enabled: false, title: "Offre Bienvenue", buttonText: "Découvrir" } },
            { key: 'chatbot_config', value: { enabled: true } },
            { key: 'reviews_config', value: { enabled: true, title: "Avis Clients", googleMapsLink: "" } },
            { key: 'whatsapp_config', value: { number: "212600000000" } }
        ];

        const settingsToInsert = defaultSettings.map(s => ({
            brand_id: brandData.id,
            key: s.key,
            value: s.value
        }));

        await supabase.from("site_settings").insert(settingsToInsert);

        alert("Nouvelle boutique lancée !");
        setIsModalOpen(false);
        setNewBrand({ name: "", domain: "", slug: "" });
        fetchBrands();

    } catch (err: any) {
        alert("Erreur: " + err.message);
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-3xl flex items-center gap-3">
            <ShieldCheck className="text-black" /> Gestion des Marques
          </h2>
          <p className="text-stone-500 text-sm">Contrôle global des boutiques Hadilike SAAS.</p>
        </div>
        <button 
            className="px-6 py-3 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-stone-800 transition shadow-lg font-bold text-sm"
            onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Nouvelle Boutique
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
            <div className="col-span-full text-center py-20 text-stone-400 font-serif">Chargement...</div>
        ) : (
            brands.map((brand) => (
                <div key={brand.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="p-6 border-b border-stone-50 bg-stone-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h3 className="font-serif text-lg font-bold">{brand.name}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${brand.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {brand.is_active ? 'Actif' : 'Suspendu'}
                        </span>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                            <Globe size={14} className="text-stone-400" />
                            <span className="font-medium truncate">{brand.domain || "Pas de domaine"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                            <Settings size={12} />
                            <span>ID: {brand.slug}</span>
                        </div>

                        <div className="pt-4 flex gap-2">
                            <Link href={`/superadmin/brands/${brand.id}`} className="flex-1">
                                <button className="w-full py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-black transition flex items-center justify-center gap-2">
                                    <Settings size={12} /> Configurer
                                </button>
                            </Link>
                            <a 
                                href={brand.domain ? `https://${brand.domain}` : '#'} 
                                target="_blank"
                                className="p-2 border border-stone-200 rounded-lg text-stone-400 hover:text-black hover:bg-stone-50 transition"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 scale-in-center animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif text-2xl font-bold">Lancer une Boutique</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-black transition">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleCreateBrand} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-2">Nom de la marque</label>
                        <input 
                            type="text" 
                            placeholder="ex: Hadilike Casablanca"
                            className="w-full p-3 border border-stone-200 rounded-xl focus:border-black outline-none transition"
                            value={newBrand.name}
                            onChange={(e) => setNewBrand({...newBrand, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-")})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-2">Domaine (Optionnel)</label>
                        <input 
                            type="text" 
                            placeholder="ex: fleurs-casa.ma"
                            className="w-full p-3 border border-stone-200 rounded-xl focus:border-black outline-none transition"
                            value={newBrand.domain}
                            onChange={(e) => setNewBrand({...newBrand, domain: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-2">Slug URL interne</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl text-stone-400 text-sm outline-none"
                            value={newBrand.slug}
                            readOnly
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-4 border border-stone-200 rounded-xl text-sm font-bold text-stone-500 hover:bg-stone-50 transition"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-4 bg-black text-white rounded-xl text-sm font-bold hover:bg-stone-800 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg transition"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : "Créer la boutique"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}