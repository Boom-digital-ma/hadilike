"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Save, Loader2, X, Plus, Trash2 } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import Alert, { AlertType } from "@/components/Alert";

export default function OccasionsAdmin() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [occasions, setOccasions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ label: "", slug: "", image_url: "", display_order: 0 });
  const [saving, setSaving] = useState(false);
  const [alertState, setAlertState] = useState<{ message: string; type: AlertType } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchData();
  }, [params.id, supabase]);

  async function fetchData() {
    try {
        setLoading(true);
        // 1. Fetch Category Info
        const { data: cat, error: catError } = await supabase.from("categories").select("*").eq("id", params.id).single();
        if (catError) throw catError;
        setCategory(cat);

        // 2. Fetch Occasions
        const { data: occs, error: occError } = await supabase
            .from("occasions")
            .select("*")
            .eq("category_id", params.id)
            .order("display_order");
        if (occError) throw occError;
        setOccasions(occs || []);
    } catch (err) {
        console.error("Error in fetchData:", err);
    } finally {
        setLoading(false);
    }
  }

  const startEdit = (occ: any) => {
    setEditingId(occ.id);
    setEditForm({ 
        label: occ.label, 
        slug: occ.slug, 
        image_url: occ.image_url,
        display_order: occ.display_order 
    });
  };

  const handleSave = async (id: string | null) => {
    setSaving(true);
    
    const data = {
        ...editForm,
        category_id: params.id,
        brand_id: category.brand_id
    };

    let error;
    if (id && id !== "new") {
        const { error: err } = await supabase.from("occasions").update(data).eq("id", id);
        error = err;
    } else {
        const { error: err } = await supabase.from("occasions").insert(data);
        error = err;
    }

    if (error) {
        setAlertState({ message: "Erreur: " + error.message, type: "error" });
    } else {
        setAlertState({ message: id === "new" ? "Sous-catégorie créée !" : "Sous-catégorie mise à jour !", type: "success" });
        fetchData();
        setEditingId(null);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette sous-catégorie ?")) return;
    const { error } = await supabase.from("occasions").delete().eq("id", id);
    if (!error) {
        setAlertState({ message: "Sous-catégorie supprimée", type: "info" });
        fetchData();
    }
  };

  if (loading) return <div className="p-10 text-center text-stone-400 font-serif">Chargement...</div>;

  return (
    <div className="space-y-8 pb-20">
      {alertState && <Alert message={alertState.message} type={alertState.type} onClose={() => setAlertState(null)} />}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-black transition">
            <ArrowLeft size={16} /> Retour aux catégories
        </button>
        <button 
            onClick={() => {
                setEditingId("new");
                setEditForm({ label: "", slug: "", image_url: "", display_order: occasions.length + 1 });
            }}
            className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-stone-800 transition"
        >
            <Plus size={18} /> Ajouter une occasion
        </button>
      </div>

      <div>
        <h2 className="font-serif text-3xl mb-1">Sous-catégories : {category?.title}</h2>
        <p className="text-stone-500 text-sm">Gérez les occasions et leurs visuels pour cette catégorie.</p>
      </div>

      <div className="grid gap-6">
        {editingId === "new" && (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm space-y-6 animate-in fade-in duration-300">
                <h3 className="font-serif text-lg font-bold text-blue-900">Nouvelle sous-catégorie</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-blue-400 mb-1">Nom de l'occasion</label>
                            <input 
                                type="text" placeholder="ex: Amour" 
                                className="w-full p-2.5 border border-stone-200 rounded-lg focus:border-black outline-none transition bg-white"
                                value={editForm.label}
                                onChange={(e) => setEditForm({...editForm, label: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-")})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-blue-400 mb-1">Slug URL</label>
                            <input 
                                type="text" placeholder="ex: amour" 
                                className="w-full p-2.5 border border-stone-200 rounded-lg focus:border-black outline-none text-xs text-stone-400 bg-white"
                                value={editForm.slug}
                                onChange={(e) => setEditForm({...editForm, slug: e.target.value})}
                            />
                        </div>
                    </div>
                    <ImageUploader 
                        onUploadSuccess={(url) => setEditForm({...editForm, image_url: url})}
                        folder="occasions"
                        label="Image de couverture"
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-blue-100">
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-blue-600 font-medium">Annuler</button>
                    <button onClick={() => handleSave("new")} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition">
                        {saving && <Loader2 size={14} className="animate-spin" />} Créer l'occasion
                    </button>
                </div>
            </div>
        )}

        {occasions.map((occ) => (
            <div key={occ.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                {editingId === occ.id ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <input 
                                    type="text" 
                                    value={editForm.label}
                                    onChange={(e) => setEditForm({...editForm, label: e.target.value})}
                                    className="w-full p-2.5 border border-stone-200 rounded-lg focus:border-black outline-none font-serif text-lg bg-white"
                                />
                                <ImageUploader 
                                    onUploadSuccess={(url) => setEditForm({...editForm, image_url: url})}
                                    folder="occasions"
                                    label="Modifier l'image"
                                />
                            </div>
                            <div className="aspect-square w-32 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 mx-auto md:mx-0 shadow-inner">
                                <img src={editForm.image_url} className="w-full h-full object-cover" alt="" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t border-stone-50">
                            <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-stone-500 font-medium transition hover:text-black">Annuler</button>
                            <button onClick={() => handleSave(occ.id)} disabled={saving} className="px-6 py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-stone-800 transition">
                                {saving ? "Sauvegarde..." : "Mettre à jour"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 shadow-sm relative group">
                            <img src={occ.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h3 className="font-serif text-xl font-bold text-stone-900">{occ.label}</h3>
                            <p className="text-xs text-stone-400 uppercase tracking-widest">Slug: {occ.slug}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(occ)} className="p-3 text-stone-400 hover:text-black hover:bg-stone-50 rounded-full transition">
                                <Edit size={20} />
                            </button>
                            <button onClick={() => handleDelete(occ.id)} className="p-3 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
}