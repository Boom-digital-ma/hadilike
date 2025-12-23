"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { Suspense } from "react";

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { order } = useOrder();
  
  const imgSrc = searchParams.get("img") || "";

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto animate-in fade-in zoom-in duration-500 flex flex-col min-h-[70vh]">
        <button
            onClick={() => router.back()}
            className="mb-6 text-sm text-stone-500 hover:text-black flex items-center gap-1 transition"
        >
            <ArrowLeft className="w-4 h-4" /> Retour à la sélection
        </button>

        <div className="flex-grow">
            <div 
                className="w-full h-96 aspect-square rounded-2xl overflow-hidden shadow-2xl mb-8 bg-white border border-stone-100 bg-cover bg-center"
                style={{ backgroundImage: `url('${decodeURIComponent(imgSrc)}')` }}
            >
            </div>

            <div className="text-center mb-8">
                <h2 className="font-serif text-3xl mb-2">Notre Signature</h2>
                <p className="text-stone-500 uppercase tracking-[0.2em] text-xs mb-4">{order.category}</p>
                <div className="inline-block px-6 py-2 bg-stone-100 rounded-full font-bold text-lg">
                    {order.budget}
                </div>
            </div>
        </div>

        <button
            onClick={() => router.push("/commander/details")}
            className="w-full py-5 bg-brand-black text-white rounded-xl font-serif text-xl tracking-wide hover:bg-stone-800 transition shadow-lg"
        >
            Commander maintenant
        </button>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center">Chargement...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
