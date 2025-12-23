"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ImageSlider from "@/components/ImageSlider";
import { Toast, ToastType } from "@/components/Toast";
import { SHOP_CONFIG } from "@/data/shop-config";

export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Find config by ID
  const serviceConfig = SHOP_CONFIG.find(c => c.id === slug);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Message envoyé ! Nous vous répondrons sous peu.", "success");
    setTimeout(() => {
        router.push("/");
    }, 2000);
  };

  if (!serviceConfig) {
    return (
        <div className="pt-32 pb-12 px-6 text-center min-h-screen">
            <h1 className="font-serif text-2xl">Service introuvable</h1>
            <Link href="/" className="text-stone-500 underline mt-4 block">Retour à l'accueil</Link>
        </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Link
        href="/"
        className="mb-6 text-sm text-stone-500 hover:text-black flex items-center gap-1 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Retour Accueil
      </Link>

      {serviceConfig.sliderImages && <ImageSlider images={serviceConfig.sliderImages} />}

      <h2 className="font-serif text-3xl mb-2">{serviceConfig.title}</h2>
      <p className="text-stone-600 mb-6 italic text-sm">
        Pour vos projets d'exception, notre atelier conçoit des scénographies uniques.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Votre Nom"
          className="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black transition"
          required
        />
        <input
          type="tel"
          placeholder="Téléphone"
          className="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black transition"
          required
        />
        <textarea
          placeholder="Décrivez votre projet..."
          rows={4}
          className="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black transition"
          required
        ></textarea>
        <button className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition">
          Envoyer la demande
        </button>
      </form>
    </div>
  );
}
