"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2, Globe, Palette, Type, Layout } from "lucide-react";
import Alert, { AlertType } from "@/components/Alert";

export const dynamic = "force-dynamic";

export default function BrandDetails() {
  const params = useParams();
  const router = useRouter();
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertState, setAlertState] = useState<{ message: string; type: AlertType } | null>(null);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    fetchBrand();
  }, [supabase, params.id]);

  async function fetchBrand() {
    setLoading(true);
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error(error);
      setAlertState({ message: "Erreur lors du chargement de la marque", type: "error" });
    } else {
      setBrand(data);
    }
    setLoading(false);
  }

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("brands")
      .update({
        name: brand.name,
        domain: brand.domain,
        is_active: brand.is_active,
        theme_config: brand.theme_config
      })
      .eq("id", brand.id);

    if (error) {
      setAlertState({ message: "Erreur: " + error.message, type: "error" });
    } else {
      setAlertState({ message: "Marque mise à jour avec succès !", type: "success" });
    }
    setSaving(false);
  };

  const updateTheme = (section: string, key: string, value: string) => {
    setBrand((prev: any) => ({
      ...prev,
      theme_config: {
        ...prev.theme_config,
        [section]: {
          ...prev.theme_config?.[section],
          [key]: value
        }
      }
    }));
  };

  if (loading) return <div className="p-10 text-center text-stone-400 font-serif">Chargement...</div>;
  if (!brand) return <div className="p-10 text-center text-red-400 font-serif">Marque introuvable.</div>;

  return (
    <div className="space-y-8 pb-20">
      {alertState && <Alert message={alertState.message} type={alertState.type} onClose={() => setAlertState(null)} />}
      
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-black transition">
            <ArrowLeft size={16} /> Retour aux marques
        </button>
        <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-stone-800 flex items-center gap-2 transition disabled:opacity-50"
        >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Enregistrer les modifications
        </button>
      </div>

      <div>
        <h2 className="font-serif text-3xl mb-2">{brand.name}</h2>
        <div className="flex gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 bg-stone-100 px-2 py-1 rounded">ID: {brand.slug}</span>
            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${brand.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {brand.is_active ? 'Active' : 'Suspendue'}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* INFO GÉNÉRALES */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <h3 className="flex items-center gap-2 font-bold text-lg text-stone-800 border-b border-stone-100 pb-4">
                <Globe size={18} /> Informations Générales
            </h3>
            
            <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Nom de la marque</label>
                <input 
                    type="text" 
                    value={brand.name}
                    onChange={(e) => setBrand({...brand, name: e.target.value})}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:border-black outline-none transition"
                />
            </div>

            <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Nom de domaine</label>
                <input 
                    type="text" 
                    value={brand.domain || ""}
                    onChange={(e) => setBrand({...brand, domain: e.target.value})}
                    placeholder="ex: ma-boutique.com"
                    className="w-full p-3 border border-stone-200 rounded-lg focus:border-black outline-none transition"
                />
            </div>

            <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={brand.is_active} 
                        onChange={(e) => setBrand({...brand, is_active: e.target.checked})}
                        className="w-5 h-5 accent-black"
                    />
                    <span className="text-sm font-medium">Boutique Active</span>
                </label>
            </div>
        </div>

        {/* THÈME & APPARENCE */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <h3 className="flex items-center gap-2 font-bold text-lg text-stone-800 border-b border-stone-100 pb-4">
                <Palette size={18} /> Apparence & Thème
            </h3>

            <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-stone-400 flex items-center gap-2">
                    <Layout size={12} /> Couleurs
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[9px] uppercase font-bold text-stone-400 mb-1">Primaire</label>
                        <div className="flex gap-2">
                            <input 
                                type="color" 
                                value={brand.theme_config?.colors?.primary || "#000000"}
                                onChange={(e) => updateTheme('colors', 'primary', e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer border-none p-0"
                            />
                            <input 
                                type="text" 
                                value={brand.theme_config?.colors?.primary || ""}
                                onChange={(e) => updateTheme('colors', 'primary', e.target.value)}
                                className="w-full p-2 border border-stone-200 rounded text-xs"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] uppercase font-bold text-stone-400 mb-1">Accent</label>
                        <div className="flex gap-2">
                            <input 
                                type="color" 
                                value={brand.theme_config?.colors?.accent || "#f4d03f"}
                                onChange={(e) => updateTheme('colors', 'accent', e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer border-none p-0"
                            />
                            <input 
                                type="text" 
                                value={brand.theme_config?.colors?.accent || ""}
                                onChange={(e) => updateTheme('colors', 'accent', e.target.value)}
                                className="w-full p-2 border border-stone-200 rounded text-xs"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-stone-50">
                <h4 className="text-xs font-bold uppercase text-stone-400 flex items-center gap-2">
                    <Type size={12} /> Typographie
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[9px] uppercase font-bold text-stone-400 mb-1">Titres</label>
                        <input 
                            type="text" 
                            value={brand.theme_config?.fonts?.heading || "Urbanist"}
                            onChange={(e) => updateTheme('fonts', 'heading', e.target.value)}
                            className="w-full p-2 border border-stone-200 rounded text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] uppercase font-bold text-stone-400 mb-1">Corps</label>
                        <input 
                            type="text" 
                            value={brand.theme_config?.fonts?.body || "Manrope"}
                            onChange={(e) => updateTheme('fonts', 'body', e.target.value)}
                            className="w-full p-2 border border-stone-200 rounded text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
