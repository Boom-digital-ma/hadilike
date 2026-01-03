"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Alert, { AlertType } from "@/components/Alert";
import { useBrand } from "@/context/BrandContext";
import { saveLead } from "@/lib/leads";

export default function ContactPage() {
  const router = useRouter();
  const { brand } = useBrand();
  const [alertState, setAlertState] = useState<{ message: string; type: AlertType } | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^(\+212|0)([ \-_/]*)(\d[ \-_/]*){9}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand) return;

    if (!validateEmail(formData.email)) {
        setAlertState({ message: "Veuillez entrer une adresse email valide.", type: "error" });
        return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
        setAlertState({ message: "Veuillez entrer un numéro de téléphone valide au Maroc.", type: "error" });
        return;
    }

    setSubmitting(true);

    try {
        await saveLead(brand.id, {
            type: 'contact',
            name: formData.name,
            phone: formData.phone || 'Non renseigné',
            email: formData.email,
            message: formData.message
        });
        setAlertState({ message: "Message envoyé ! Nous vous répondrons sous peu.", type: "success" });
        setTimeout(() => {
            router.push("/");
        }, 2000);
    } catch (err) {
        setAlertState({ message: "Erreur lors de l'envoi.", type: "error" });
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto">
      {alertState && <Alert message={alertState.message} type={alertState.type} onClose={() => setAlertState(null)} />}
      
      <Link
        href="/"
        className="mb-6 text-sm text-stone-500 hover:text-black flex items-center gap-1 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Retour Accueil
      </Link>

      <h2 className="font-serif text-3xl mb-6">Contactez l'Atelier</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input 
            type="text" 
            placeholder="Nom complet" 
            className="w-full p-4 border border-stone-200 rounded outline-none focus:border-black transition"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
        />
        <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-4 border border-stone-200 rounded outline-none focus:border-black transition"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
        />
        <input 
            type="tel" 
            placeholder="Téléphone / WhatsApp" 
            className="w-full p-4 border border-stone-200 rounded outline-none focus:border-black transition"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
        />
        <textarea 
            placeholder="Décrivez votre projet..." 
            rows={5} 
            className="w-full p-4 border border-stone-200 rounded outline-none focus:border-black transition"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            required
        ></textarea>
        <button 
            disabled={submitting}
            className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition disabled:opacity-70"
        >
            {submitting ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
