"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, MessageSquare, Calendar, Sparkles, MapPin } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Alert, { AlertType } from "@/components/Alert";

export default function OrderSummaryPage() {
  const router = useRouter();
  const { order } = useOrder();
  const { addToCart } = useCart();
  const [alertState, setAlertState] = useState<{ message: string; type: AlertType } | null>(null);

  const handleAddToCart = () => {
    addToCart(order);
    setAlertState({ message: "Création ajoutée au panier", type: "success" });
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto">
      {alertState && <Alert message={alertState.message} type={alertState.type} onClose={() => setAlertState(null)} />}

      <Link href="/commander/details" className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Link>

      <h3 className="font-serif text-3xl mb-8">Récapitulatif</h3>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm mb-8">
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-stone-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Votre Choix</p>
              <p className="font-serif text-lg leading-tight">{order.category}</p>
              <p className="text-sm text-stone-500">{order.occasion} • {order.style}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-stone-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Livraison</p>
              <p className="text-stone-800">{order.date}</p>
              <p className="text-sm text-stone-500">Créneau : {order.slot}</p>
            </div>
          </div>

          {order.message && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-stone-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Message Carte</p>
                <p className="text-sm text-stone-600 italic">"{order.message}"</p>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-stone-100 flex justify-between items-center">
            <p className="font-serif text-xl">Budget</p>
            <p className="font-serif text-2xl font-bold">{order.budget}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full py-5 bg-brand-black text-white rounded-full font-serif text-lg tracking-wide hover:bg-stone-800 transition shadow-xl flex items-center justify-center gap-3"
      >
        <ShoppingCart className="w-5 h-5" />
        Ajouter au panier
      </button>

      <p className="mt-6 text-center text-[10px] text-stone-400 uppercase tracking-widest">
        Paiement sécurisé à l'étape suivante
      </p>
    </div>
  );
}