"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { 
  ShieldCheck, 
  Globe, 
  Users, 
  Activity, 
  ShoppingBag, 
  TrendingUp,
  ArrowUpRight,
  Plus
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    brands: 0,
    admins: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [brandsRes, adminsRes, ordersRes] = await Promise.all([
          supabase.from("brands").select("*", { count: "exact", head: true }),
          supabase.from("brand_admins").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("total_amount", { count: "exact" }),
        ]);

        const totalRevenue = ordersRes.data?.reduce((acc: number, curr: any) => acc + Number(curr.total_amount), 0) || 0;

        setStats({
          brands: brandsRes.count || 0,
          admins: adminsRes.count || 0,
          orders: ordersRes.count || 0,
          revenue: totalRevenue,
        });
      } catch (err) {
        console.error("Error fetching superadmin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [supabase]);

  const cards = [
    { label: "Boutiques", value: stats.brands, icon: Globe, href: "/superadmin/brands", color: "bg-blue-500" },
    { label: "Admins", value: stats.admins, icon: Users, href: "/superadmin/users", color: "bg-purple-500" },
    { label: "Commandes", value: stats.orders, icon: ShoppingBag, href: "/superadmin/health", color: "bg-green-500" },
    { label: "CA Global", value: `${stats.revenue.toLocaleString()} DH`, icon: TrendingUp, href: "#", color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-4xl font-bold tracking-tight">Console SuperAdmin</h2>
        <p className="text-stone-500 mt-2 text-lg">Bienvenue sur le centre de contrôle de la plateforme Hadilike.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <Link 
            key={idx} 
            href={card.href}
            className="group bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${card.color}`}></div>
            <card.icon className="text-stone-400 mb-6 group-hover:text-black transition-colors" size={32} />
            <div className="text-4xl font-bold tracking-tight mb-1">{loading ? "..." : card.value}</div>
            <div className="text-sm font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-600 transition-colors">{card.label}</div>
            <ArrowUpRight className="absolute bottom-6 right-6 text-stone-300 group-hover:text-black transition-colors" size={20} />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-stone-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="font-serif text-3xl mb-4 italic">Nouvelle Opportunité ?</h3>
            <p className="text-stone-400 mb-8 max-w-sm leading-relaxed">
              Déployez une nouvelle instance de Hadilike pour une nouvelle ville ou un nouveau partenaire en quelques secondes.
            </p>
            <Link 
              href="/superadmin/brands"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-stone-200 transition"
            >
              <Plus size={20} /> Lancer une boutique
            </Link>
          </div>
          <Globe className="absolute -right-20 -bottom-20 text-white/5" size={400} />
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-10 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Activity className="text-green-600" size={24} />
            </div>
            <div>
              <h4 className="font-bold">Santé Système</h4>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Temps réel</p>
            </div>
          </div>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Tous les systèmes sont opérationnels. La base de données et les services de stockage répondent normalement.
          </p>
          <Link 
            href="/superadmin/health"
            className="text-black font-bold flex items-center gap-2 hover:gap-4 transition-all"
          >
            Voir les détails <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}