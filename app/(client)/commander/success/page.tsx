"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowRight, Flower2 } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import { useBrand } from "@/context/BrandContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { settings } = useBrand();
  const orderId = searchParams.get("id");
  const name = searchParams.get("name");
  const total = searchParams.get("total");
  const method = searchParams.get("method");

  // Get WhatsApp number from settings
  const whatsappNumber = settings?.whatsapp_config?.number || "212661000000"; 

  const getWhatsAppLink = () => {
    const message = `Bonjour Hadilike ! Je viens de passer une commande.\n\n` +
                    `*Référence :* #${orderId?.slice(0, 8)}\n` +
                    `*Nom :* ${name}\n` +
                    `*Montant :* ${total} DH\n` +
                    `*Paiement :* ${method === 'cod' ? 'À la livraison' : method === 'western' ? 'Cash Plus' : 'PayPal'}\n\n` +
                    `Pouvez-vous me confirmer la bonne réception ? Merci !`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="bg-brand-bg min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-stone-100 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="font-serif text-3xl mb-4 text-stone-900">Merci, {name} !</h1>
        <p className="text-stone-500 mb-8 leading-relaxed italic font-serif">
          "Votre commande est entre les mains de nos artisans fleuristes. Elle sera préparée avec le plus grand soin."
        </p>

        <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 mb-10 text-left space-y-3">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-stone-400 font-bold">
                <span>Référence</span>
                <span className="text-stone-900">#{orderId?.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-stone-400 font-bold">
                <span>Statut</span>
                <span className="text-stone-900">En cours de validation</span>
            </div>
        </div>

        <div className="space-y-4">
            <a 
                href={getWhatsAppLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-5 bg-[#25D366] text-white rounded-full font-serif text-lg flex items-center justify-center gap-3 hover:bg-[#20ba56] transition shadow-lg"
            >
                <MessageCircle className="w-6 h-6" />
                Confirmer sur WhatsApp
            </a>

            <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition text-sm font-medium pt-4">
                Retour à la boutique <ArrowRight className="w-4 h-4" />
            </Link>
        </div>

        <div className="mt-12 flex justify-center gap-2 text-stone-200">
            <Flower2 size={24} />
            <Flower2 size={24} />
            <Flower2 size={24} />
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-serif text-stone-400 animate-pulse text-xl uppercase tracking-widest">Hadilike...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
