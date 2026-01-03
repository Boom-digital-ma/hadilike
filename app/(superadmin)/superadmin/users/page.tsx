"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { User, Shield, Building2, Mail, Plus, X, Loader2 } from "lucide-react";
import { createBrandAdmin } from "@/app/admin-actions";

export const dynamic = "force-dynamic";

export default function SuperAdminUsers() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    fetchData();
  }, [supabase]);

  async function fetchData() {
    try {
      setLoading(true);
      // Fetch Admins
      const { data: adminsData, error: adminsError } = await supabase
        .from("brand_admins")
        .select(`
          role,
          user_id,
          brands (name, slug)
        `);

      if (adminsError) throw adminsError;
      setAdmins(adminsData || []);

      // Fetch Brands for dropdown
      const { data: brandsData, error: brandsError } = await supabase
        .from("brands")
        .select("id, name")
        .eq("is_active", true)
        .order("name");
        
      if (brandsError) throw brandsError;
      setBrands(brandsData || []);

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await createBrandAdmin(null, formData);
    
    setSubmitting(false);
    
    if (res.success) {
        alert(res.message);
        setIsModalOpen(false);
        fetchData(); // Refresh list
    } else {
        alert(res.message);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="font-serif text-3xl flex items-center gap-3">
            <User className="text-black" /> Administrateurs
            </h2>
            <p className="text-stone-500 text-sm">Liste des utilisateurs ayant accès aux interfaces de gestion.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-stone-800 transition shadow-lg font-bold text-sm"
        >
            <Plus size={18} />
            Ajouter un Admin
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-widest text-stone-500 font-bold">
            <tr>
              <th className="px-6 py-4">Utilisateur (UUID)</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="px-6 py-4">Boutique</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-10 text-center text-stone-400 font-serif">Chargement...</td></tr>
            ) : admins.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-10 text-center text-stone-400 font-serif italic">Aucun administrateur trouvé.</td></tr>
            ) : (
              admins.map((admin, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition-colors text-sm">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Mail size={14} className="text-stone-400" />
                        <span className="font-mono text-xs">{admin.user_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${
                        admin.role === 'super_admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                        {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-stone-600">
                        <Building2 size={14} />
                        {admin.brands?.name || "Accès Global"}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 scale-in-center animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif text-2xl font-bold">Ajouter un Admin</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-black transition">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleCreateUser} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-2">Email</label>
                        <input 
                            name="email"
                            type="email" 
                            placeholder="admin@boutique.com"
                            className="w-full p-3 border border-stone-200 rounded-xl focus:border-black outline-none transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-2">Mot de passe provisoire</label>
                        <input 
                            name="password"
                            type="password" 
                            placeholder="••••••••"
                            minLength={6}
                            className="w-full p-3 border border-stone-200 rounded-xl focus:border-black outline-none transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-2">Boutique assignée</label>
                        <div className="relative">
                            <select 
                                name="brandId"
                                className="w-full p-3 border border-stone-200 rounded-xl focus:border-black outline-none transition appearance-none bg-white"
                                required
                            >
                                <option value="">Sélectionner une boutique...</option>
                                {brands.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                            <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-black text-white rounded-xl text-sm font-bold hover:bg-stone-800 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg transition"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : "Créer l'utilisateur"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}