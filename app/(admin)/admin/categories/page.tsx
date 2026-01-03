"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Edit, Save, Loader2, X, Layout, Layers } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import Link from "next/link";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", subtitle: "", cover_image: "", display_order: 0 });
  const [saving, setSaving] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("categories").select("*").order("display_order");
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [supabase]);

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditForm({ 
        title: cat.title, 
        subtitle: cat.subtitle || "", 
        cover_image: cat.cover_image,
        display_order: cat.display_order
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    const { error } = await supabase
        .from("categories")
        .update({ 
            title: editForm.title, 
            subtitle: editForm.subtitle, 
            cover_image: editForm.cover_image,
            display_order: editForm.display_order
        })
        .eq("id", id);

    if (error) {
        alert("Erreur: " + error.message);
    } else {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...editForm } : c));
        setEditingId(null);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className="font-serif text-3xl">Gestion des Catégories</h2>
        <p className="text-stone-500 text-sm">Modifiez les titres, sous-titres et images de fond des catégories.</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
            <div className="text-center py-10 text-stone-400">Chargement...</div>
        ) : (
            categories.map((cat) => (
                <div key={cat.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    {editingId === cat.id ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Titre</label>
                                        <input 
                                            type="text" 
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                            className="w-full p-2.5 border border-stone-300 rounded-lg focus:border-black outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Sous-titre</label>
                                        <input 
                                            type="text" 
                                            value={editForm.subtitle}
                                            onChange={(e) => setEditForm({...editForm, subtitle: e.target.value})}
                                            className="w-full p-2.5 border border-stone-300 rounded-lg focus:border-black outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Ordre d'affichage</label>
                                        <input 
                                            type="number" 
                                            value={editForm.display_order}
                                            onChange={(e) => setEditForm({...editForm, display_order: parseInt(e.target.value)})}
                                            className="w-full p-2.5 border border-stone-300 rounded-lg focus:border-black outline-none"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <ImageUploader 
                                        onUploadSuccess={(url) => setEditForm({...editForm, cover_image: url})}
                                        folder="categories"
                                        label="Image de fond (Background)"
                                    />
                                    {editForm.cover_image && (
                                        <p className="text-[10px] text-stone-400 mt-2 truncate">Actuel: {editForm.cover_image}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                                <button onClick={cancelEdit} className="px-4 py-2 text-sm text-stone-500 hover:text-black transition">Annuler</button>
                                <button 
                                    onClick={() => handleSave(cat.id)}
                                    disabled={saving}
                                    className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-stone-800 flex items-center gap-2 transition disabled:opacity-50"
                                >
                                    {saving && <Loader2 size={14} className="animate-spin" />}
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-full md:w-48 h-24 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 shadow-sm relative group">
                                <img src={cat.cover_image} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                    <h3 className="font-serif text-xl font-bold text-stone-900">{cat.title}</h3>
                                    <span className="text-[10px] px-2 py-0.5 bg-stone-100 rounded text-stone-500 uppercase font-bold">{cat.type}</span>
                                </div>
                                <p className="text-sm text-stone-500 mb-1">{cat.subtitle || "Sans sous-titre"}</p>
                                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Ordre : {cat.display_order}</p>
                            </div>
                            <div className="flex gap-2">
                                {cat.type === 'product' && (
                                    <Link href={`/admin/categories/${cat.id}/occasions`}>
                                        <button 
                                            className="p-3 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                                            title="Gérer les occasions"
                                        >
                                            <Layers size={20} />
                                        </button>
                                    </Link>
                                )}
                                <button 
                                    onClick={() => startEdit(cat)}
                                    className="p-3 text-stone-400 hover:text-black hover:bg-stone-50 rounded-full transition"
                                    title="Modifier"
                                >
                                    <Edit size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))
        )}
      </div>
    </div>
  );
}
