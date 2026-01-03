"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Trash2, Plus, Image as ImageIcon, Loader2, X, Save, Edit } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import Alert, { AlertType } from "@/components/Alert";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function GalleryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [occasions, setOccasions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [images, setImages] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [alertState, setAlertState] = useState<{ message: string; type: AlertType } | null>(null);
  
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageType, setNewImageType] = useState("inspiration");
  const [newImageTitle, setNewImageTitle] = useState("");
  const [newImagePrice, setNewImagePrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    async function initPage() {
      try {
        setLoading(true);
        const { data: cats, error: catError } = await supabase.from("categories").select("*").order("title");
        const { data: imgCounts, error: countError } = await supabase.from("gallery_images").select("category_id");

        if (catError) throw catError;

        if (cats) {
            setCategories(cats);
            if (cats.length > 0) setSelectedCategory(cats[0].id);
        }

        if (imgCounts) {
            const c: Record<string, number> = {};
            imgCounts.forEach((i: any) => c[i.category_id] = (c[i.category_id] || 0) + 1);
            setCounts(c);
        }
      } catch (err) {
          console.error("Error in initPage:", err);
      } finally {
          setLoading(false);
      }
    }
    initPage();
  }, [supabase]);

  useEffect(() => {
    if (selectedCategory) {
        setOccasions([]);
        setSelectedOccasion("all");
        supabase.from("occasions").select("*").eq("category_id", selectedCategory).then(({ data }: any) => {
            setOccasions(data || []);
        });
    }
  }, [selectedCategory, supabase]);

  useEffect(() => {
    if (selectedCategory) {
        fetchImages(selectedCategory, selectedOccasion);
    }
  }, [selectedCategory, selectedOccasion, supabase]);

  async function fetchImages(catId: string, occId: string) {
    setImagesLoading(true);
    try {
        let query = supabase
            .from("gallery_images")
            .select("*")
            .eq("category_id", catId);
        
        if (occId !== "all") {
            query = query.eq("occasion_id", occId);
        } else {
            query = query.is("occasion_id", null);
        }

        const { data, error } = await query.order("display_order");
        
        if (error) {
            console.error("Supabase error in fetchImages:", error);
        } else {
            setImages(data || []);
        }
    } catch (err) {
        console.error("Unexpected error in fetchImages:", err);
    } finally {
        setImagesLoading(false);
    }
  }

  const startEdit = (img: any) => {
    setEditingId(img.id);
    setNewImageUrl(img.image_url);
    setNewImageType(img.usage_type);
    setNewImageTitle(img.title || "");
    setNewImagePrice(img.price || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewImageUrl("");
    setNewImageType("inspiration");
    setNewImageTitle("");
    setNewImagePrice("");
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl || !selectedCategory) return;
    setSubmitting(true);

    try {
        const { data: brandData } = await supabase.from("brands").select("id").limit(1).single();
        
        const imageData: any = {
            image_url: newImageUrl,
            usage_type: newImageType,
            occasion_id: selectedOccasion !== "all" ? selectedOccasion : null
        };

        if (newImageType === 'best_seller') {
            imageData.title = newImageTitle || "Coup de Cœur";
            imageData.price = newImagePrice || "650 DH";
            imageData.target_config = { style: "Création du Chef", occasion: "Plaisir" };
        } else {
            imageData.title = null;
            imageData.price = null;
        }

        if (editingId) {
            const { data, error } = await supabase
                .from("gallery_images")
                .update(imageData)
                .eq("id", editingId)
                .select()
                .single();
            if (error) throw error;
            setImages(prev => prev.map((img: any) => img.id === editingId ? data : img));
            setAlertState({ message: "Média mis à jour !", type: "success" });
        } else {
            imageData.brand_id = brandData?.id;
            imageData.category_id = selectedCategory;
            imageData.display_order = images.length + 1;

            const { data, error } = await supabase.from("gallery_images").insert(imageData).select().single();
            if (error) throw error;

            setImages([...images, data]);
            setCounts({ ...counts, [selectedCategory]: (counts[selectedCategory] || 0) + 1 });
            setAlertState({ message: "Média ajouté avec succès !", type: "success" });
        }

        cancelEdit();
    } catch (err: any) {
        setAlertState({ message: "Erreur: " + err.message, type: "error" });
    } finally {
        setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette image ?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (!error) {
        setImages(prev => prev.filter((img: any) => img.id !== id));
        setCounts({ ...counts, [selectedCategory]: Math.max(0, (counts[selectedCategory] || 1) - 1) });
        if (editingId === id) cancelEdit();
        setAlertState({ message: "Média supprimé", type: "info" });
    }
  };

  if (loading) return <div className="p-10 text-center font-serif text-stone-400">Initialisation de la galerie...</div>;

  return (
    <div className="space-y-8 pb-20">
      {alertState && <Alert message={alertState.message} type={alertState.type} onClose={() => setAlertState(null)} />}
      
      <div>
        <h2 className="font-serif text-3xl">Galerie & Médias</h2>
        <p className="text-stone-500 text-sm">Gérez les images de sliders et les best-sellers par catégorie et occasion.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Catégories */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            <h3 className="text-xs font-bold uppercase text-stone-400 mb-4 tracking-widest text-center md:text-left">Catégories</h3>
            {categories.map((cat: any) => (
                <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition flex justify-between items-center ${
                        selectedCategory === cat.id 
                        ? "bg-black text-white shadow-md" 
                        : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                >
                    <span className="truncate mr-2">{cat.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                        selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-stone-100 text-stone-400"
                    }`}>
                        {counts[cat.id] || 0}
                    </span>
                </button>
            ))}
        </div>

        {/* Contenu Principal */}
        <div className="flex-grow space-y-8">
            {/* Filtre Occasion */}
            <div className="flex items-center gap-4 bg-stone-100 p-4 rounded-xl shadow-inner">
                <span className="text-xs font-bold uppercase text-stone-500 tracking-widest">Sous-catégorie :</span>
                <select 
                    value={selectedOccasion}
                    onChange={(e) => setSelectedOccasion(e.target.value)}
                    className="p-2 border border-stone-200 rounded-lg text-sm bg-white outline-none focus:border-black transition"
                >
                    <option value="all">Général (Toute la catégorie)</option>
                    {occasions.map((occ: any) => (
                        <option key={occ.id} value={occ.id}>{occ.label}</option>
                    ))}
                </select>
            </div>

            {/* Formulaire Ajout / Edition */}
            <div className={`p-6 rounded-xl border shadow-sm transition-colors ${editingId ? 'bg-blue-50 border-blue-200' : 'bg-white border-stone-200'}`}>
                <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
                    {editingId ? <Edit size={18} className="text-blue-600" /> : <Plus size={18} />} 
                    {editingId ? "Modifier le média" : "Ajouter un média"}
                </h3>
                <form onSubmit={handleSaveImage} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                        {editingId ? (
                            <>
                                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">URL de l'image</label>
                                <input 
                                    type="text" 
                                    placeholder="/images/bouquets/..."
                                    className="w-full p-2.5 border border-stone-200 rounded-lg outline-none focus:border-black text-sm transition bg-white"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    required
                                />
                            </>
                        ) : (
                            <ImageUploader 
                                onUploadSuccess={(url) => setNewImageUrl(url)} 
                                folder={`gallery/${categories.find(c => c.id === selectedCategory)?.slug || 'general'}`}
                                label="Uploader l'image"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Type d'usage</label>
                        <select 
                            className="w-full p-2.5 border border-stone-200 rounded-lg outline-none focus:border-black text-sm bg-white cursor-pointer"
                            value={newImageType}
                            onChange={(e) => setNewImageType(e.target.value)}
                        >
                            <option value="inspiration">Inspiration (Slider)</option>
                            <option value="best_seller">Best Seller (Produit)</option>
                            <option value="slider_hero">Hero Home</option>
                        </select>
                    </div>
                    
                    {newImageType === 'best_seller' && (
                        <>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Titre du produit</label>
                                <input 
                                    type="text" 
                                    placeholder="ex: Bouquet Éclat d'Hiver"
                                    className="w-full p-2.5 border border-stone-200 rounded-lg outline-none focus:border-black text-sm transition bg-white"
                                    value={newImageTitle}
                                    onChange={(e) => setNewImageTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Prix affiché</label>
                                <input 
                                    type="text" 
                                    placeholder="ex: 580 DH"
                                    className="w-full p-2.5 border border-stone-200 rounded-lg outline-none focus:border-black text-sm font-bold transition bg-white"
                                    value={newImagePrice}
                                    onChange={(e) => setNewImagePrice(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="flex gap-2 w-full md:w-auto">
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={cancelEdit}
                                className="px-4 py-2.5 bg-white border border-stone-300 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-50 transition"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className={`flex-grow px-6 py-2.5 text-white rounded-lg text-sm font-bold transition disabled:opacity-50 flex items-center justify-center gap-2 h-[42px] ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-stone-800'}`}
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {submitting ? "Enregistrement..." : (editingId ? "Mettre à jour" : "Enregistrer")}
                        </button>
                    </div>
                </form>
            </div>

            {/* Grille Images */}
            <div>
                <h3 className="text-xs font-bold uppercase text-stone-400 mb-4 tracking-widest flex items-center gap-2">
                    Contenu de {selectedOccasion === 'all' ? "la catégorie" : "l'occasion"}
                </h3>
                {imagesLoading ? (
                    <div className="text-center py-20 text-stone-400 font-serif">Chargement des médias...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img: any) => (
                            <div key={img.id} className="group relative aspect-square bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm transition-all hover:shadow-md">
                                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                                    <div className="flex justify-between items-start">
                                        <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-tighter ${
                                            img.usage_type === 'best_seller' ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white'
                                        }`}>
                                            {img.usage_type}
                                        </span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => startEdit(img)}
                                                className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition shadow-lg"
                                                title="Modifier"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(img.id)}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {img.usage_type === 'best_seller' && (
                                        <div className="text-white">
                                            <p className="font-serif text-sm font-bold truncate">{img.title}</p>
                                            <p className="text-xs font-bold text-yellow-400">{img.price}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {images.length === 0 && (
                            <div className="col-span-full py-20 text-center text-stone-400 italic bg-stone-50 rounded-2xl border border-stone-200 border-dashed">
                                <ImageIcon size={40} className="mx-auto mb-4 opacity-20" />
                                <p>Aucun média trouvé.</p>
                                <p className="text-[10px] uppercase mt-2">Choisissez une sous-catégorie ou ajoutez des images.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}