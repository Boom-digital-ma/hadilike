"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { useCart } from "@/context/CartContext";
import { Toast, ToastType } from "@/components/Toast";
import { useState } from "react";

export default function SummaryPage() {
  const router = useRouter();
  const { order, resetOrder } = useOrder();
  const { addToCart } = useCart();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleAddToCart = () => {
    const newOrder = { 
        ...order, 
        id: `HDL-${Math.floor(Math.random() * 10000)}` 
    };
    addToCart(newOrder);
    resetOrder();
    setToast({ message: "Création ajoutée au panier", type: "success" });
    // Redirect to home or show cart
    setTimeout(() => router.push("/"), 1000);
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button onClick={() => router.back()} className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </button>

      <h3 className="font-serif text-2xl mb-6">Récapitulatif</h3>

      <div className="bg-white p-6 rounded shadow-sm border border-stone-100 mb-6">
        <p className="text-sm text-stone-500 uppercase tracking-widest mb-1">
        Catégorie
        </p>
        <p className="font-serif text-xl mb-4 text-black">
        {order.category}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
            <span className="text-stone-500">Occasion:</span> <br />
            <span className="font-bold">{order.occasion || "Sur mesure"}</span>
        </div>
        {/* Conditional display for Style or Extras */}
        {(order.occasion === "Plaisir d'offrir" && order.category === "Bouquets") || order.category === "Boîtes à fleurs" ? (
            <div className="col-span-2">
                <span className="text-stone-500">Extras:</span> <br />
                <span className="font-bold text-xs">{(order.extras?.length ?? 0) > 0 ? order.extras?.join(", ") : "Aucun"}</span>
                {order.specialRequest && (
                    <p className="mt-1 text-xs italic text-stone-600">Note: {order.specialRequest}</p>
                )}
            </div>
        ) : (
            <div>
                <span className="text-stone-500">Style:</span> <br />
                <span className="font-bold">{order.style || "Personnalisé"}</span>
            </div>
        )}
        <div>
            <span className="text-stone-500">Budget:</span> <br />
            <span className="font-bold">{order.budget}</span>
        </div>
        <div>
            <span className="text-stone-500">Date:</span> <br />
            <span className="font-bold">
            {order.date} ({order.slot})
            </span>
        </div>
        </div>

        <p className="text-sm text-stone-500">Message :</p>
        <p className="italic text-stone-800 font-serif">
        "{order.message || "Aucun message"}"
        </p>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition shadow-lg"
      >
        Ajouter au Panier ({order.budget})
      </button>

      <div className="mt-6 space-y-2 text-center">
        <p className="text-xs text-stone-500">
          ✓ Vous recevez une validation de votre commande après paiement par notre atelier.
        </p>
        <p className="text-xs text-stone-500">
          ✓ Une photo réelle sera envoyée sur votre WhatsApp pour validation avant livraison le jour J.
        </p>
      </div>
    </div>
  );
}
