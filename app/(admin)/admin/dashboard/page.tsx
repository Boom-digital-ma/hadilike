"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ShoppingBag, Mail, TrendingUp, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, leads: 0, customers: 0 });
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchStats() {
      const [ordersRes, leadsRes] = await Promise.all([
        supabase.from("orders").select("total_amount", { count: "exact" }),
        supabase.from("leads").select("*", { count: "exact" })
      ]);

      const totalRevenue = ordersRes.data?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

      setStats({
        orders: ordersRes.count || 0,
        revenue: totalRevenue,
        leads: leadsRes.count || 0,
        customers: 0 // Can be derived from unique phone numbers if needed
      });
      setLoading(false);
    }
    fetchStats();
  }, [supabase]);

  if (loading) return <div className="p-10 text-center font-serif text-stone-400">Chargement des statistiques...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl">Tableau de bord</h2>
        <p className="text-stone-500 text-sm">Aperçu global de votre activité Hadilike.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-stone-50 rounded-lg text-stone-600">
                    <ShoppingBag size={24} />
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">GLOBAL</span>
            </div>
            <h3 className="text-sm uppercase text-stone-400 font-bold mb-1 tracking-widest">Commandes</h3>
            <p className="text-4xl font-serif">{stats.orders}</p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-stone-50 rounded-lg text-stone-600">
                    <TrendingUp size={24} />
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">DH</span>
            </div>
            <h3 className="text-sm uppercase text-stone-400 font-bold mb-1 tracking-widest">Chiffre d'affaires</h3>
            <p className="text-4xl font-serif">{stats.revenue.toLocaleString()} <span className="text-lg">DH</span></p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-stone-50 rounded-lg text-stone-600">
                    <Mail size={24} />
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">NEW</span>
            </div>
            <h3 className="text-sm uppercase text-stone-400 font-bold mb-1 tracking-widest">Demandes (Leads)</h3>
            <p className="text-4xl font-serif">{stats.leads}</p>
        </div>
      </div>

      <div className="bg-stone-900 p-8 rounded-2xl text-white flex flex-col md:row justify-between items-center gap-6 shadow-xl">
        <div>
            <h3 className="font-serif text-2xl mb-2">Prêt pour une nouvelle ville ?</h3>
            <p className="text-stone-400 text-sm">Vous pouvez étendre Hadilike à de nouvelles zones en un clic.</p>
        </div>
        <button 
            onClick={() => window.location.href='/admin/cities'}
            className="px-8 py-4 bg-white text-black rounded-full font-serif text-lg hover:bg-stone-200 transition"
        >
            Ajouter une ville
        </button>
      </div>
    </div>
  );
}
