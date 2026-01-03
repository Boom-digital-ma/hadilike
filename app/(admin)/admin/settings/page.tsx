"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Save, Loader2, MessageSquare, Megaphone, Star, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import Alert, { AlertType } from "@/components/Alert";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertState, setAlertState] = useState<{ message: string; type: AlertType } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        // Get brand ID first
        const { data: brandData } = await supabase.from("brands").select("id").limit(1).single();
        if (!brandData) throw new Error("Marque non trouvée");

        const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .eq('brand_id', brandData.id);

        if (error) throw error;

        const settingsMap: Record<string, any> = {};
        data?.forEach((s) => (settingsMap[s.key] = s));
        setSettings(settingsMap);
      } catch (err) {
        console.error("Error in fetchSettings:", err);
        // Handle error in UI
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [supabase]);

  const updateSettingValue = (key: string, newValue: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [key]: { ...prev[key], value: newValue, key: key }, // Preserve key
    }));
  };


  const handleSave = async (key: string) => {
    setSaving(true);
    const setting = settings[key];
    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: setting.id, key: setting.key, value: setting.value, brand_id: setting.brand_id });

    if (error) {
        setAlertState({ message: "Erreur: " + error.message, type: "error" });
    } else {
        setAlertState({ message: "Réglage mis à jour avec succès !", type: "success" });
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center font-serif text-stone-400">Chargement...</div>;

  return (
    <div className="space-y-8 pb-20">
      {alertState && <Alert message={alertState.message} type={alertState.type} onClose={() => setAlertState(null)} />}
      <div>
        <h2 className="font-serif text-3xl">Configuration Site</h2>
        <p className="text-stone-500 text-sm">Gérez le marketing et les outils interactifs du site.</p>
      </div>

      {/* PROMO POPUP */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Megaphone size={18} className="text-stone-500" />
            <h3 className="font-serif text-lg font-bold">Modal Publicitaire</h3>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={settings.promo_popup?.value?.enabled} 
                    onChange={(e) => updateSettingValue('promo_popup', { ...settings.promo_popup.value, enabled: e.target.checked })}
                    className="w-4 h-4 accent-black"
                />
                <span className="text-sm font-medium">Activé</span>
            </label>
            <button 
                onClick={() => handleSave('promo_popup')}
                className="px-4 py-2 bg-black text-white text-xs rounded hover:bg-stone-800 transition flex items-center gap-2"
            >
                <Save size={14} /> Enregistrer
            </button>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Titre</label>
                    <input 
                        type="text" 
                        value={settings.promo_popup?.value?.title || ""} 
                        onChange={(e) => updateSettingValue('promo_popup', { ...settings.promo_popup.value, title: e.target.value })}
                        className="w-full p-2 border border-stone-200 rounded outline-none focus:border-black"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Description</label>
                    <textarea 
                        rows={3}
                        value={settings.promo_popup?.value?.description || ""} 
                        onChange={(e) => updateSettingValue('promo_popup', { ...settings.promo_popup.value, description: e.target.value })}
                        className="w-full p-2 border border-stone-200 rounded outline-none focus:border-black text-sm"
                    />
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Texte Bouton</label>
                    <input 
                        type="text" 
                        value={settings.promo_popup?.value?.buttonText || ""} 
                        onChange={(e) => updateSettingValue('promo_popup', { ...settings.promo_popup.value, buttonText: e.target.value })}
                        className="w-full p-2 border border-stone-200 rounded outline-none focus:border-black"
                    />
                </div>
                <div>
                    <ImageUploader 
                        onUploadSuccess={(url) => updateSettingValue('promo_popup', { ...settings.promo_popup.value, image: url })}
                        folder="marketing"
                        label="Image de la promo"
                    />
                    {settings.promo_popup?.value?.image && (
                        <p className="text-[9px] text-stone-400 mt-1 truncate">Actuel: {settings.promo_popup.value.image}</p>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* CHATBOT */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-stone-500" />
            <h3 className="font-serif text-lg font-bold">Chatbot Conciergerie</h3>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={settings.chatbot_config?.value?.enabled} 
                    onChange={(e) => updateSettingValue('chatbot_config', { ...settings.chatbot_config.value, enabled: e.target.checked })}
                    className="w-4 h-4 accent-black"
                />
                <span className="text-sm font-medium">Activé</span>
            </label>
            <button 
                onClick={() => handleSave('chatbot_config')}
                className="px-4 py-2 bg-black text-white text-xs rounded hover:bg-stone-800 transition flex items-center gap-2"
            >
                <Save size={14} /> Enregistrer
            </button>
          </div>
        </div>
        <div className="p-6">
            <p className="text-sm text-stone-500 italic">Le chatbot utilise les messages de bienvenue configurés dans le code pour le moment.</p>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {/* ... (existing reviews config) */}
      </div>

      {/* WHATSAPP & CONTACT */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-stone-500" />
            <h3 className="font-serif text-lg font-bold">Contact & WhatsApp</h3>
          </div>
          <button 
            onClick={() => handleSave('whatsapp_config')}
            className="px-4 py-2 bg-black text-white text-xs rounded hover:bg-stone-800 transition flex items-center gap-2"
          >
            <Save size={14} /> Enregistrer
          </button>
        </div>
        <div className="p-6 space-y-4">
            <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Numéro WhatsApp (Format: 2126...)</label>
                <input 
                    type="text" 
                    placeholder="212661000000"
                    value={settings.whatsapp_config?.value?.number || ""} 
                    onChange={(e) => updateSettingValue('whatsapp_config', { ...settings.whatsapp_config?.value, number: e.target.value })}
                    className="w-full p-2 border border-stone-200 rounded outline-none focus:border-black"
                />
                <p className="text-[10px] text-stone-400 mt-1 italic">N'ajoutez pas de "+" ni d'espaces. Exemple: 212661223344</p>
            </div>
        </div>
      </div>
    </div>
  );
}
