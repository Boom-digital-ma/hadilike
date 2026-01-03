"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, Phone, Mail, CreditCard, Box, MapPin, Clock, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const getWhatsAppLink = (phone: string, name: string) => {
    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) formattedPhone = "212" + formattedPhone.slice(1);
    const message = `Bonjour ${name}, c'est l'atelier floral Hadilike. Nous avons bien reçu votre commande. Pouvons-nous échanger concernant la livraison ?`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    const { error } = await supabase
        .from("orders")
        .update({ order_status: newStatus })
        .eq("id", params.id);
    
    if (error) alert("Erreur: " + error.message);
    else setOrder({ ...order, order_status: newStatus });
    setUpdating(false);
  };

  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data, error } = await supabase
            .from("orders")
            .select(`
            *,
            cities (name),
            brands (name)
            `)
            .eq("id", params.id)
            .single();

        if (error) {
            console.error("Supabase Error:", error);
            alert("Erreur chargement: " + error.message);
        } else {
            setOrder(data);
        }
      } catch (err: any) {
          console.error("Unexpected error:", err);
          alert("Erreur inattendue: " + err.message);
      } finally {
          setLoading(false);
      }
    }

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, supabase]);

  if (loading) return <div className="p-10 text-center font-serif text-stone-400">Chargement des détails...</div>;
  if (!order) return <div className="p-10 text-center text-red-500 font-serif">Commande introuvable.</div>;

  const items = Array.isArray(order.items) ? order.items : [];

  const statusColors: Record<string, string> = {
    'new': 'bg-blue-100 text-blue-700 border-blue-200',
    'confirmed': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'delivered': 'bg-green-100 text-green-700 border-green-200',
    'cancelled': 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className="pb-20">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-stone-500 hover:text-black mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16} /> Retour aux commandes
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Commande #{order.id.slice(0, 8)}</h1>
          <p className="text-stone-500 text-sm">
            Passée le {format(new Date(order.created_at), "d MMMM yyyy à HH:mm", { locale: fr })}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Statut Livraison</label>
                <select 
                    value={order.order_status} 
                    onChange={(e) => updateStatus(e.target.value)}
                    disabled={updating}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border outline-none focus:ring-2 focus:ring-black transition ${statusColors[order.order_status] || 'bg-stone-100'}`}
                >
                    <option value="new">Nouvelle</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                </select>
            </div>
            
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Paiement</label>
                <span className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                    order.payment_status === 'PAID' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'
                }`}>
                    {order.payment_status} ({order.payment_method})
                </span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Client Info */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
          <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-4 flex items-center gap-2">
            <User size={14} /> Client
          </h3>
          <p className="font-serif text-lg mb-1">{order.customer_name}</p>
          <div className="space-y-1 text-sm text-stone-600 mb-6">
            <p className="flex items-center gap-2"><Phone size={14} /> {order.customer_phone}</p>
            {order.customer_email && <p className="flex items-center gap-2"><Mail size={14} /> {order.customer_email}</p>}
          </div>
          
          <a 
            href={getWhatsAppLink(order.customer_phone, order.customer_name)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto w-full py-3 bg-[#25D366] text-white rounded-lg font-serif text-sm flex items-center justify-center gap-2 hover:bg-[#20ba56] transition shadow-md"
          >
            <MessageCircle size={16} />
            Contacter sur WhatsApp
          </a>
        </div>

        {/* Delivery Info (Using the first item as reference for date, usually same for cart) */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-4 flex items-center gap-2">
            <MapPin size={14} /> Livraison
          </h3>
          <p className="font-serif text-lg mb-1">{order.cities?.name}</p>
          {items.length > 0 && (
             <div className="space-y-1 text-sm text-stone-600">
                <p className="flex items-center gap-2"><Calendar size={14} /> {items[0].date}</p>
                <p className="flex items-center gap-2"><Clock size={14} /> {items[0].slot}</p>
             </div>
          )}
        </div>

        {/* Financial Info */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-4 flex items-center gap-2">
            <CreditCard size={14} /> Total
          </h3>
          <p className="font-serif text-4xl mb-1">{order.total_amount} <span className="text-lg text-stone-400">{order.currency}</span></p>
          <p className="text-xs text-stone-400">Taxes incluses</p>
        </div>
      </div>

      {/* Order Items (The Cart) */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center gap-2">
            <Box size={16} className="text-stone-500" />
            <h3 className="text-xs uppercase tracking-widest text-stone-500 font-bold">Détail du Panier</h3>
        </div>
        <div className="divide-y divide-stone-100">
            {items.map((item: any, idx: number) => (
                <div key={idx} className="p-6 flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="font-serif text-2xl text-stone-400">{idx + 1}</span>
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-serif text-xl font-bold">{item.category}</h4>
                            <span className="font-bold text-lg">{item.budget}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-stone-50 p-3 rounded border border-stone-100">
                                <p className="text-[10px] uppercase text-stone-400 font-bold mb-1">Configuration</p>
                                <p><span className="text-stone-500">Occasion:</span> {item.occasion}</p>
                                <p><span className="text-stone-500">Style:</span> {item.style}</p>
                            </div>
                            
                            {item.message && (
                                <div className="bg-orange-50 p-3 rounded border border-orange-100">
                                    <p className="text-[10px] uppercase text-orange-400 font-bold mb-1">Message Carte</p>
                                    <p className="italic text-stone-800">"{item.message}"</p>
                                </div>
                            )}
                        </div>

                        {item.extras && item.extras.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {item.extras.map((extra: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-600 shadow-sm">
                                        + {extra}
                                    </span>
                                ))}
                            </div>
                        )}
                        
                        {item.specialRequest && (
                             <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
                                <span className="font-bold text-xs uppercase mr-2">Note spéciale:</span>
                                {item.specialRequest}
                             </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
