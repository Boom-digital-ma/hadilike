"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SHOP_CONFIG, STYLES } from "@/data/shop-config";
import { useOrder } from "@/context/OrderContext";

export default function StylePage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;
  const occasionSlug = params.occasion as string;
  const styleSlug = params.style as string;
  const { order } = useOrder();

  const config = SHOP_CONFIG.find((c) => c.slug === categorySlug);
  const styleObj = STYLES.find(s => s.slug === styleSlug);
  
  if (!config || !styleObj) {
    notFound();
  }

  const occasionLabel = order.occasion || (occasionSlug === "plaisir-d-offrir" ? "Plaisir d'offrir" : occasionSlug);

  // Inspiration Image Logic
  const getInspirationImage = () => {
    const styleKey = styleObj.id;
    const folder = config.folderName;
    let src = "";

    if (occasionLabel === "Amour") {
        src = `/images/${folder}/amour/esprit/${styleKey}.jpeg`;
    } else if (occasionLabel === "Anniversaire") {
        let filename = styleKey;
        if (filename === "purte") filename = "pure";
        const ext = (styleKey === "purte" || styleKey === "boheme") ? "png" : "jpeg";
        src = `/images/${folder}/anniversaire/espirt/${filename}.${ext}`;
    } else {
        // Fallback
        src = `/images/composition.jpeg`;
    }
    return src;
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
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
            className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
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
