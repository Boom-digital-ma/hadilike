"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Star, Trash2, Eye, EyeOff, Plus, Save, X } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Review State
  const [newReview, setNewReview] = useState({ author_name: "", content: "", rating: 5, is_visible: true });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (err) {
          console.error("Error fetching reviews:", err);
      } finally {
          setLoading(false);
      }
    }
    fetchReviews();
  }, [supabase]);

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("reviews")
      .update({ is_visible: !currentStatus })
      .eq("id", id);

    if (!error) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, is_visible: !currentStatus } : r));
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;
    
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (!error) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get brand ID (fetch first brand for now)
    const { data: brandData } = await supabase.from("brands").select("id").limit(1).single();
    if (!brandData) return;

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        brand_id: brandData.id,
        ...newReview
      })
      .select()
      .single();

    if (error) {
        alert("Erreur: " + error.message);
    } else {
        setReviews([data, ...reviews]);
        setIsModalOpen(false);
        setNewReview({ author_name: "", content: "", rating: 5, is_visible: true });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-3xl">Avis Clients</h2>
          <p className="text-stone-500 text-sm">Gérez les témoignages affichés sur le site.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-stone-800 transition shadow-md"
        >
          <Plus size={18} />
          Ajouter un avis
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-widest text-stone-500 font-bold">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Note</th>
              <th className="px-6 py-4 w-1/2">Message</th>
              <th className="px-6 py-4 text-center">Visible</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-stone-400 font-serif">Chargement...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-stone-400 font-serif italic">Aucun avis pour le moment.</td></tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-stone-900">{review.author_name}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-stone-300"} />
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600 italic">"{review.content}"</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase ${review.is_visible ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                        {review.is_visible ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button 
                        onClick={() => toggleVisibility(review.id, review.is_visible)}
                        className="p-2 text-stone-400 hover:text-black hover:bg-stone-50 rounded-full transition"
                        title={review.is_visible ? "Masquer" : "Afficher"}
                    >
                      {review.is_visible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button 
                        onClick={() => deleteReview(review.id)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                        title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Ajout */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl font-bold">Nouveau Témoignage</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-black">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleCreateReview} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Nom du client</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-stone-300 rounded-lg focus:border-black outline-none"
                            value={newReview.author_name}
                            onChange={(e) => setNewReview({...newReview, author_name: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Note (1-5)</label>
                        <select 
                            className="w-full p-3 border border-stone-300 rounded-lg focus:border-black outline-none bg-white"
                            value={newReview.rating}
                            onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                        >
                            <option value="5">5 étoiles</option>
                            <option value="4">4 étoiles</option>
                            <option value="3">3 étoiles</option>
                            <option value="2">2 étoiles</option>
                            <option value="1">1 étoile</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Message</label>
                        <textarea 
                            rows={4}
                            className="w-full p-3 border border-stone-300 rounded-lg focus:border-black outline-none text-sm"
                            value={newReview.content}
                            onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-stone-800 flex justify-center items-center gap-2"
                    >
                        <Save size={16} />
                        Enregistrer
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
