"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { useBrand } from "@/context/BrandContext";
import { useState, useEffect } from "react";
import { getStyles } from "@/lib/api";

export default function StylePage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;
  const occasionSlug = params.occasion as string;
  const styleSlug = params.style as string;
  const { order } = useOrder();
  const { brand, categories } = useBrand();

  const [styles, setStyles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const config = categories.find((c) => c.slug === categorySlug);

  useEffect(() => {
    if (brand) {
      getStyles(brand.id).then(data => {
        setStyles(data);
        setLoading(false);
      });
    }
  }, [brand]);

  if (!loading && !config) {
    notFound();
  }

  const styleObj = styles.find(s => s.slug === styleSlug);
  
  if (!loading && !styleObj) {
    // If loading finished and style not found
    notFound();
  }

  if (loading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center font-serif">Chargement...</div>;

  const occasionLabel = order.occasion || (occasionSlug === "plaisir-d-offrir" ? "Plaisir d'offrir" : occasionSlug);

  // Inspiration Image Logic
  const getInspirationImage = () => {
    const styleKey = styleObj.slug;
    const isBoite = config.slug === "boites-a-fleurs";
    const folder = isBoite ? "boites" : "boquets";
    let src = "";

    if (occasionSlug === "amour") {
        let filename = styleKey;
        if (filename === "purete") filename = "purte";
        src = `/images/${folder}/amour/esprit/${filename}.jpeg`;
    } else if (occasionSlug === "anniversaire") {
        let filename = styleKey;
        if (filename === "purete") filename = "pure";
        const ext = (styleKey === "purete" || styleKey === "boheme") ? "png" : "jpeg";
        src = `/images/${folder}/anniversaire/espirt/${filename}.${ext}`;
    } else {
        // Fallback
        src = `/images/composition.jpeg`;
    }
    return src;
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto">
      <Link href={`/${categorySlug}/${occasionSlug}`} className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Link>

      <h3 className="font-serif text-2xl mb-2">Inspiration {styleObj.label}</h3>
      <p className="text-sm text-stone-500 mb-6 italic">
        "Chaque création est unique et dépend de l'arrivage du matin."
      </p>

      <div className="w-full aspect-square rounded-lg overflow-hidden mb-8 shadow-inner bg-stone-100 relative">
        <img 
            src={getInspirationImage()} 
            className="w-full h-full object-cover"
            alt={`Inspiration ${styleObj.label}`}
            onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/composition.jpeg";
            }}
        />
      </div>

      <button
        onClick={() => router.push("/commander/budget")}
        className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition shadow-md"
      >
        Continuer vers le budget
      </button>
    </div>
  );
}