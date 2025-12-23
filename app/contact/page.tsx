"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toast, ToastType } from "@/components/Toast";

export default function ContactPage() {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

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

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Link
        href="/"
        className="mb-6 text-sm text-stone-500 hover:text-black flex items-center gap-1 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Retour Accueil
      </Link>

      <h2 className="font-serif text-3xl mb-2">Contactez-nous</h2>
      <p className="text-stone-600 mb-6 italic text-sm">
        Une question ? Notre équipe est à votre écoute pour vous accompagner dans vos projets floraux.
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
          placeholder="Votre message..."
          rows={4}
          className="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black transition"
          required
        ></textarea>
        <button className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition">
          Envoyer le message
        </button>
      </form>
    </div>
  );
}
