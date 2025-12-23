"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SHOP_CONFIG, STYLES } from "@/data/shop-config";
import { useOrder } from "@/context/OrderContext";

export default function OccasionPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;
  const occasionSlug = params.occasion as string;
  const { order, setOrder } = useOrder();

  const config = SHOP_CONFIG.find((c) => c.slug === categorySlug);
  
  if (!config) {
    notFound();
  }

  // Find occasion object to get label? Or just rely on URL context + previous state?
  // Ideally rely on previous state, but deep linking requires finding it.
  const occasionObj = config.occasions?.find(o => o.slug === occasionSlug);
  const occasionLabel = occasionObj?.label || (occasionSlug === "plaisir-d-offrir" ? "Plaisir d'offrir" : occasionSlug);

  // Logic:
  // If Boites OR Plaisir -> Show Extras/Description form.
  // Else -> Show Styles.

  const isExtrasFlow = config.id === "Boîtes à fleurs" || occasionLabel === "Plaisir d'offrir";

  const handleStyleClick = (style: any) => {
    setOrder(prev => ({ ...prev, style: style.label }));
    router.push(`/${categorySlug}/${occasionSlug}/${style.slug}`);
  };

  const handleExtrasSubmit = () => {
    // Navigate to Budget
    router.push("/commander/budget");
  };

  const toggleExtra = (extra: string) => {
    setOrder(prev => {
        const currentExtras = prev.extras || [];
        const newExtras = currentExtras.includes(extra) 
            ? currentExtras.filter(e => e !== extra)
            : [...currentExtras, extra];
        return { ...prev, extras: newExtras };
    });
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <Link href={`/${categorySlug}`} className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Link>

      {isExtrasFlow ? (
        <div>
            <h3 className="font-serif text-2xl mb-6">Les petits plus</h3>
            <div className="space-y-3 mb-8">
                {["Boîte", "Chocolat Ferrero Rocher", "Chocolat Raffaello", "Spéciale commande"]
                    .filter(extra => {
                    if (config.id === "Boîtes à fleurs" || occasionLabel === "Plaisir d'offrir") {
                        return extra !== "Boîte" && extra !== "Spéciale commande";
                    }
                    return true;
                    })
                    .map((extra) => (
                    <label key={extra} className="flex items-center gap-3 p-4 border border-stone-200 rounded cursor-pointer hover:bg-stone-50 transition">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-black"
                            checked={order.extras?.includes(extra) || false}
                            onChange={() => toggleExtra(extra)}
                        />
                        <span className="font-serif text-lg">{extra}</span>
                    </label>
                ))}
            </div>
            
            <div className="mb-8">
                <label className="block text-sm text-stone-500 uppercase tracking-widest mb-2">
                    {config.descriptionLabel || "Commentaire"}
                </label>
                <textarea 
                    className="w-full p-4 border border-stone-200 rounded focus:border-black outline-none transition"
                    rows={3}
                    placeholder={config.descriptionPlaceholder || "Une précision pour le fleuriste ?"}
                    value={order.specialRequest || ""}
                    onChange={(e) => setOrder(prev => ({...prev, specialRequest: e.target.value}))}
                ></textarea>
            </div>

            <button 
                onClick={handleExtrasSubmit}
                className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition"
            >
                Continuer vers le budget
            </button>
        </div>
      ) : (
        <div>
            <h3 className="font-serif text-2xl mb-6">L'Esprit du bouquet</h3>
            <div className="grid grid-cols-2 gap-4">
            {STYLES
            .filter(style => {
                if (config.id === "Bouquets" && occasionLabel === "Anniversaire" && style.id === "purte") {
                    return false;
                }
                return true;
            })
            .map((style) => {
                let imgSrc = null;
                const folder = config.folderName;
                
                if (occasionLabel === "Amour" && style.id !== "surprise") {
                    imgSrc = `/images/${folder}/amour/esprit/${style.id}.jpeg`;
                } else if (occasionLabel === "Anniversaire" && style.id !== "surprise") {
                    let filename = style.id;
                    if (filename === "purte") filename = "pure";
                    const ext = (style.id === "purte" || style.id === "boheme") ? "png" : "jpeg";
                    imgSrc = `/images/${folder}/anniversaire/espirt/${filename}.${ext}`;
                }

                return (
                <button
                    key={style.id}
                    onClick={() => handleStyleClick(style)}
                    className="cursor-pointer group text-center"
                >
                    <div className={`h-32 ${style.color} rounded mb-2 group-hover:scale-105 transition shadow-sm flex items-center justify-center overflow-hidden relative`}>
                    {imgSrc ? (
                        <img src={imgSrc} className="absolute inset-0 w-full h-full object-cover" alt={style.label} />
                    ) : (
                        style.dark && <span className="text-white text-3xl font-serif">?</span>
                    )}
                    </div>
                    <p className="font-serif">{style.label}</p>
                </button>
                );
            })}
            </div>
        </div>
      )}
    </div>
  );
}
