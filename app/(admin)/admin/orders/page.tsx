"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Truck,
  Eye,
  Search,
  MessageCircle
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    async function fetchData() {
      const [ordersRes, citiesRes] = await Promise.all([
        supabase.from("orders").select(`*, cities (id, name)`).order("created_at", { ascending: false }),
        supabase.from("cities").select("id, name").order("name")
      ]);

      if (ordersRes.error) console.error(ordersRes.error);
      else setOrders(ordersRes.data || []);

      if (citiesRes.error) console.error(citiesRes.error);
      else setCities(citiesRes.data || []);

      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold border border-green-100 flex items-center gap-1 w-fit"><CheckCircle2 size={10} /> Payé</span>;
      case "PENDING_COD":
        return <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 flex items-center gap-1 w-fit"><Truck size={10} /> À la livraison</span>;
      case "PENDING_WESTERN_UNION":
        return <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold border border-orange-100 flex items-center gap-1 w-fit"><Clock size={10} /> Cash Plus</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-stone-50 text-stone-600 text-[10px] font-bold border border-stone-100 w-fit">{status}</span>;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-black uppercase border border-blue-200">Nouveau</span>;
      case "confirmed":
        return <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase border border-indigo-200">Confirmé</span>;
      case "delivered":
        return <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[9px] font-black uppercase border border-green-200">Livré</span>;
      case "cancelled":
        return <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[9px] font-black uppercase border border-red-200">Annulé</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[9px] font-black uppercase border border-stone-200">{status}</span>;
    }
  };

  const getWhatsAppLink = (phone: string, name: string) => {
    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) formattedPhone = "212" + formattedPhone.slice(1);
    const message = `Bonjour ${name}, c'est l'atelier floral Hadilike. Nous avons bien reçu votre commande. Pouvons-nous échanger concernant la livraison ?`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer_phone.includes(searchTerm);
    const matchesCity = selectedCity === "all" || (o.cities && o.cities.id === selectedCity);
    return matchesSearch && matchesCity;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-3xl">Commandes</h2>
          <p className="text-stone-500 text-sm">Gérez vos ventes et les livraisons à venir.</p>
        </div>
        <div className="flex gap-4">
            <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="pl-4 pr-8 py-2 border border-stone-200 rounded-lg focus:border-black outline-none bg-white shadow-sm transition text-sm cursor-pointer"
            >
                <option value="all">Toutes les villes</option>
                {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                ))}
            </select>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Rechercher un client..." 
                    className="pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:border-black outline-none w-64 bg-white shadow-sm transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-widest text-stone-500 font-bold">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Montant</th>
              <th className="px-6 py-4 text-center">Paiement</th>
              <th className="px-6 py-4 text-center">Livraison</th>
              <th className="px-6 py-4">Ville</th>
              <th className="px-6 py-4">Date Commande</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-stone-400 font-serif">Chargement des commandes...</td></tr>
            ) : paginatedOrders.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-stone-400 font-serif italic">Aucune commande trouvée.</td></tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors group text-sm">
                  <td className="px-6 py-4">
                    <div className="font-bold text-stone-900">{order.customer_name}</div>
                    <div className="text-[10px] text-stone-400 font-medium">{order.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold">{order.total_amount} {order.currency}</div>
                    <div className="text-[10px] text-stone-400 uppercase font-medium">{order.payment_method}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">{getStatusBadge(order.payment_status)}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">{getDeliveryStatusBadge(order.order_status)}</div>
                  </td>
                  <td className="px-6 py-4 text-stone-600 text-xs">
                    {order.cities?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-stone-400 text-[10px] font-medium">
                    {format(new Date(order.created_at), "d MMM yyyy HH:mm", { locale: fr })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <a 
                            href={getWhatsAppLink(order.customer_phone, order.customer_name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[#25D366] hover:bg-green-50 rounded-full transition"
                            title="Contacter sur WhatsApp"
                        >
                            <MessageCircle size={18} />
                        </a>
                        <Link href={`/admin/orders/${order.id}`}>
                            <button className="p-2 text-stone-400 hover:text-black transition hover:bg-stone-100 rounded-full" title="Voir les détails">
                                <Eye size={18} />
                            </button>
                        </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-stone-200 flex justify-between items-center bg-stone-50">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-bold uppercase disabled:opacity-50 hover:bg-white transition"
                >
                    Précédent
                </button>
                <span className="text-xs text-stone-500 font-medium">
                    Page {currentPage} sur {totalPages}
                </span>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-bold uppercase disabled:opacity-50 hover:bg-white transition"
                >
                    Suivant
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
