"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageCircle, Mail, Phone, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setLeads(data || []);
      setLoading(false);
    }
    fetchLeads();
  }, [supabase]);

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className="font-serif text-3xl">Demandes de Contact</h2>
        <p className="text-stone-500 text-sm">Suivi des prospects (Wedding, Corporate, Contact).</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-widest text-stone-500 font-bold">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 w-1/2">Message</th>
              <th className="px-6 py-4 text-right">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-stone-400 font-serif">Chargement...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-stone-400 font-serif italic">Aucune demande reçue.</td></tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-stone-50 transition-colors align-top">
                  <td className="px-6 py-4 text-xs text-stone-500 whitespace-nowrap">
                    {format(new Date(lead.created_at), "d MMM yyyy", { locale: fr })}<br/>
                    {format(new Date(lead.created_at), "HH:mm", { locale: fr })}
                  </td>
                  <td className="px-6 py-4 font-medium text-stone-900">
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-stone-400" />
                        {lead.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 bg-stone-100 rounded text-[10px] font-bold uppercase tracking-wider text-stone-600">
                        {lead.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600 italic leading-relaxed">
                    "{lead.message}"
                  </td>
                  <td className="px-6 py-4 text-right space-y-1">
                    <div className="flex items-center justify-end gap-2 text-xs">
                        {lead.phone} <Phone size={12} className="text-stone-400" />
                    </div>
                    {lead.email && (
                        <div className="flex items-center justify-end gap-2 text-xs text-blue-600 hover:underline cursor-pointer">
                            {lead.email} <Mail size={12} />
                        </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
