"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { Toast, ToastType } from "@/components/Toast";
import { useState } from "react";

export default function DetailsPage() {
  const router = useRouter();
  const { order, setOrder } = useOrder();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const getMinDate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    let minDate = new Date();
    if (currentHour >= 14) {
      minDate.setDate(minDate.getDate() + 1);
    }
    return minDate.toISOString().split("T")[0];
  };

  const isLate = new Date().getHours() >= 14;

  const validate = () => {
    if (!order.date || !order.slot) {
      setToast({ message: "Veuillez choisir une date et un créneau.", type: "error" });
      return;
    }
    router.push("/commander/summary");
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <button onClick={() => router.back()} className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </button>

      <h3 className="font-serif text-2xl mb-6">Détails de livraison</h3>

      <div className="space-y-6">
        <div>
        <label className="block text-sm uppercase tracking-wide text-stone-500 mb-2">
            Message Carte
        </label>
        <textarea
            rows={3}
            className="w-full p-3 bg-white border border-stone-300 rounded focus:border-black focus:ring-0 outline-none transition"
            placeholder="Votre mot doux..."
            value={order.message}
            onChange={(e) =>
            setOrder(prev => ({ ...prev, message: e.target.value }))
            }
        ></textarea>
        </div>

        <div>
        <label className="block text-sm uppercase tracking-wide text-stone-500 mb-2">
            Date de livraison
        </label>
        <input
            type="date"
            min={getMinDate()}
            value={order.date}
            onChange={(e) =>
            setOrder(prev => ({ ...prev, date: e.target.value }))
            }
            className="w-full p-3 bg-white border border-stone-300 rounded focus:border-black outline-none mb-2"
        />
        {isLate && (
            <p className="text-xs text-orange-600">
            Il est plus de 14h, livraison pour aujourd'hui impossible.
            </p>
        )}
        </div>

        <div>
        <label className="block text-sm uppercase tracking-wide text-stone-500 mb-2">
            Créneau
        </label>
        <div className="flex gap-4">
            {["Matin", "Soir"].map((slot) => (
            <label
                key={slot}
                className={`flex-1 p-3 border rounded cursor-pointer text-center transition ${
                order.slot === slot
                    ? "bg-black text-white border-black"
                    : "border-stone-300 hover:bg-stone-50"
                }`}
            >
                <input
                type="radio"
                name="slot"
                value={slot}
                checked={order.slot === slot}
                onChange={(e) =>
                    setOrder(prev => ({ ...prev, slot: e.target.value }))
                }
                className="hidden"
                />
                {slot}
            </label>
            ))}
        </div>
        </div>

        <button
        onClick={validate}
        className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide mt-4 hover:bg-stone-800 transition"
        >
        Voir le récapitulatif
        </button>
      </div>
    </div>
  );
}
