"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Activity, Database, Globe, Users, CheckCircle2, AlertCircle, RefreshCw, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SuperAdminHealth() {
  const [stats, setStats] = useState({
    brands: 0,
    admins: 0,
    orders: 0,
    leads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<"online" | "offline" | "checking">("checking");
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    fetchHealthData();
  }, [supabase]);

  async function fetchHealthData() {
    setLoading(true);
    setDbStatus("checking");

    try {
      // Check DB connection and fetch counts
      const [brandsRes, adminsRes, ordersRes, leadsRes] = await Promise.all([
        supabase.from("brands").select("*", { count: "exact", head: true }),
        supabase.from("brand_admins").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }),
      ]);

      if (brandsRes.error) throw brandsRes.error;

      setStats({
        brands: brandsRes.count || 0,
        admins: adminsRes.count || 0,
        orders: ordersRes.count || 0,
        leads: leadsRes.count || 0,
      });
      setDbStatus("online");
    } catch (err) {
      console.error("Health check error:", err);
      setDbStatus("offline");
    } finally {
      setLoading(false);
    }
  }

  const healthCards = [
    { label: "Boutiques Actives", value: stats.brands, icon: Globe, color: "text-blue-600" },
    { label: "Administrateurs", value: stats.admins, icon: Users, color: "text-purple-600" },
    { label: "Total Commandes", value: stats.orders, icon: Activity, color: "text-green-600" },
    { label: "Leads Capturés", value: stats.leads, icon: Database, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-3xl flex items-center gap-3">
            <Activity className="text-black" /> État de la Plateforme
          </h2>
          <p className="text-stone-500 text-sm">Surveillance en temps réel des services et données.</p>
        </div>
        <button 
          onClick={fetchHealthData}
          className="p-2 hover:bg-stone-100 rounded-full transition"
          title="Rafraîchir"
        >
          <RefreshCw className={`${loading ? 'animate-spin' : ''} text-stone-400`} size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <card.icon className={card.color} size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total</span>
            </div>
            <div className="text-3xl font-bold">{loading ? "..." : card.value}</div>
            <div className="text-xs text-stone-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
          <h3 className="font-bold text-sm uppercase tracking-widest text-stone-600">Statut des Services</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
            <div className="flex items-center gap-4">
              <Database size={20} className="text-stone-400" />
              <div>
                <div className="font-bold text-sm">Base de données Supabase</div>
                <div className="text-xs text-stone-500">Connexion PostgreSQL et Temps réel</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {dbStatus === "online" ? (
                <>
                  <span className="text-xs font-bold text-green-600">OPÉRATIONNEL</span>
                  <CheckCircle2 size={16} className="text-green-500" />
                </>
              ) : dbStatus === "offline" ? (
                <>
                  <span className="text-xs font-bold text-red-600">ERREUR</span>
                  <AlertCircle size={16} className="text-red-500" />
                </>
              ) : (
                <Loader2 className="animate-spin text-stone-300" size={16} />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
            <div className="flex items-center gap-4">
              <Globe size={20} className="text-stone-400" />
              <div>
                <div className="font-bold text-sm">Edge Runtime</div>
                <div className="text-xs text-stone-500">Next.js App Router & Middleware</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-green-600">OPÉRATIONNEL</span>
              <CheckCircle2 size={16} className="text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

