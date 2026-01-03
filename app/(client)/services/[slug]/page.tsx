"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageSlider from "@/components/ImageSlider";
import { useBrand } from "@/context/BrandContext";
import { getGalleryImages } from "@/lib/api";
import Alert, { AlertType } from "@/components/Alert";
import { saveLead } from "@/lib/leads";
import { useState, useEffect } from "react";

export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { brand, categories } = useBrand();
  
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertState, setAlertState] = useState<{ message: string; type: AlertType } | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const validatePhone = (phone: string) => /^(\+212|0)([ \-_/]*)(d[ \-_/]*){9}$/.test(phone);

  // Find config by slug
  const serviceConfig = categories.find(c => c.slug === slug);

  // ... (useEffect remains same)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.phone && !validatePhone(formData.phone)) {
        setAlertState({ message: "Veuillez entrer un numéro de téléphone valide au Maroc.", type: "error" });
        return;
    }

    setSubmitting(true);
    try {
        await saveLead(brand.id, {
            type: slug,
            name: formData.name,
            phone: formData.phone,
            message: formData.message
        });
        setAlertState({ message: "Message envoyé ! Nous vous répondrons sous peu.", type: "success" });
        setFormData({ name: "", phone: "", message: "" });
        setTimeout(() => {
            router.push("/");
        }, 2000);
    } catch (err) {
        setAlertState({ message: "Erreur lors de l'envoi.", type: "error" });
    } finally {
        setSubmitting(false);
    }
  };

  if (!loading && !serviceConfig) {
    return (
        <div className="pt-32 pb-12 px-6 text-center min-h-screen">
            <h1 className="font-serif text-2xl">Service introuvable</h1>
            <Link href="/" className="text-stone-500 underline mt-4 block">Retour à l'accueil</Link>
        </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center font-serif">Chargement...</div>;

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto">
      {alertState && <Alert message={alertState.message} type={alertState.type} onClose={() => setAlertState(null)} />}
      
      <Link
        href="/"
        className="mb-6 text-sm text-stone-500 hover:text-black flex items-center gap-1 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Retour Accueil
      </Link>

      {sliderImages.length > 0 && <ImageSlider images={sliderImages} />}

      <h2 className="font-serif text-3xl mb-2">{serviceConfig.title}</h2>
      <p className="text-stone-600 mb-6 italic text-sm">
        Pour vos projets d'exception, notre atelier conçoit des scénographies uniques.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Votre Nom"
          className="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black transition"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="tel"
          placeholder="Téléphone"
          className="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black transition"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
        />
        <textarea
          placeholder="Décrivez votre projet..."
          rows={4}
          className="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black transition"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          required
        ></textarea>
        <button 
            disabled={submitting}
            className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition disabled:opacity-70"
        >
          {submitting ? "Envoi..." : "Envoyer la demande"}
        </button>
      </form>
    </div>
  );
}
