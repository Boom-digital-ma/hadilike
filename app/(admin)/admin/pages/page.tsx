"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Edit, Save, FileText, Loader2, X } from "lucide-react";
import Alert, { AlertType } from "@/components/Alert";

export default function PagesAdmin() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [alertState, setAlertState] = useState<{ message: string; type: AlertType } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("pages").select("*").order("title");
        if (error) throw error;
        setPages(data || []);
      } catch (err) {
        console.error("Error fetching pages:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, [supabase]);

  const startEdit = (page: any) => {
    setEditingId(page.id);
    setEditForm({ title: page.title, content: page.content || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", content: "" });
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    const { error } = await supabase
        .from("pages")
        .update({ title: editForm.title, content: editForm.content, updated_at: new Date() })
        .eq("id", id);

    if (error) {
        setAlertState({ message: "Erreur: " + error.message, type: "error" });
    } else {
        setPages(prev => prev.map(p => p.id === id ? { ...p, ...editForm } : p));
        setAlertState({ message: "Page mise à jour avec succès !", type: "success" });
        setEditingId(null);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center text-stone-400 font-serif">Chargement des pages...</div>;

  return (
    <div className="space-y-8 pb-20">
      {alertState && <Alert message={alertState.message} type={alertState.type} onClose={() => setAlertState(null)} />}
      <div>
        <h2 className="font-serif text-3xl">Pages de Contenu</h2>
        <p className="text-stone-500 text-sm">Modifiez les textes des pages statiques (CGV, À propos...).</p>
      </div>

      <div className="grid gap-6">
        {pages.map((page) => (
            <div key={page.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                {editingId === page.id ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Titre de la page</label>
                            <input 
                                type="text" 
                                value={editForm.title}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                className="w-full p-2 border border-stone-300 rounded focus:border-black outline-none font-serif text-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Contenu</label>
                            <textarea 
                                rows={10}
                                value={editForm.content}
                                onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                                className="w-full p-3 border border-stone-300 rounded focus:border-black outline-none text-sm leading-relaxed"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={cancelEdit} className="px-4 py-2 text-sm text-stone-500 hover:text-black">Annuler</button>
                            <button 
                                onClick={() => handleSave(page.id)}
                                disabled={saving}
                                className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-stone-800 flex items-center gap-2"
                            >
                                {saving && <Loader2 size={14} className="animate-spin" />}
                                Enregistrer
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText size={18} className="text-stone-400" />
                                <h3 className="font-serif text-xl font-bold">{page.title}</h3>
                            </div>
                            <p className="text-xs text-stone-400 uppercase tracking-widest mb-4">Slug: /{page.slug}</p>
                            <p className="text-stone-600 text-sm line-clamp-2 whitespace-pre-line">{page.content}</p>
                        </div>
                        <button 
                            onClick={() => startEdit(page)}
                            className="p-2 text-stone-400 hover:text-black hover:bg-stone-50 rounded-full transition"
                        >
                            <Edit size={18} />
                        </button>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
}