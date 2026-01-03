"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { useBrand } from "@/context/BrandContext";
import { useState, useEffect } from "react";
import { getStyles, getGalleryImages } from "@/lib/api";
import ImageSlider from "@/components/ImageSlider";

export default function OccasionPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;
  const occasionSlug = params.occasion as string;
  const { order, setOrder } = useOrder();
  const { brand, categories } = useBrand();

  const [styles, setStyles] = useState<any[]>([]);
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const config = categories.find((c) => c.slug === categorySlug);
  
  useEffect(() => {
    if (brand && config) {
      Promise.all([
        getStyles(brand.id),
        getGalleryImages(brand.id, config.id)
      ]).then(([styleData, imgData]) => {
        setStyles(styleData);
        // Take 'inspiration' images for the top slider
        setSliderImages(imgData.filter(i => i.usage_type === 'inspiration' || i.usage_type === 'slider_hero').map(i => i.image_url));
        setLoading(false);
      });
    } else if (categories.length > 0 && !config) {
        setLoading(false);
    }
  }, [brand, categories, config]);

  if (!loading && !config) {
    notFound();
  }

  if (loading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center font-serif">Chargement...</div>;

  const uiConfig = config.ui_config || {};
  const isBoite = config.slug === "boites-a-fleurs";
  const isBouquet = config.slug === "bouquets";
  const occasionLabel = occasionSlug === "plaisir-d-offrir" ? "Plaisir d'offrir" : (occasionSlug.charAt(0).toUpperCase() + occasionSlug.slice(1));

  const isExtrasFlow = isBoite || occasionSlug === "plaisir-d-offrir";

  const handleStyleClick = (style: any) => {
    setOrder(prev => ({ ...prev, style: style.label }));
    router.push(`/${categorySlug}/${occasionSlug}/${style.slug}`);
  };

  const handleExtrasSubmit = () => {
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
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto">
      <Link href={`/${categorySlug}`} className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Link>

      {/* Inspiration Slider */}
      {sliderImages.length > 0 && (
        <div className="mb-8">
            <ImageSlider images={sliderImages} />
        </div>
      )}

      {isExtrasFlow ? (
        <div>
            <h3 className="font-serif text-2xl mb-6">Les petits plus</h3>
            <div className="space-y-3 mb-8">
                {["Boîte", "Chocolat Ferrero Rocher", "Chocolat Raffaello", "Spéciale commande"]
                    .filter(extra => {
                    if (isBoite || occasionSlug === "plaisir-d-offrir") {
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
                    {uiConfig.descriptionLabel || "Commentaire"}
                </label>
                <textarea 
                    className="w-full p-4 border border-stone-200 rounded focus:border-black outline-none transition"
                    rows={3}
                    placeholder={uiConfig.descriptionPlaceholder || "Une précision pour le fleuriste ?"}
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
            {styles
            .filter(style => {
                if (isBouquet && occasionSlug === "anniversaire" && style.slug === "purete") {
                    return false;
                }
                return true;
            })
            .map((style) => {
                let imgSrc = null;
                const folder = isBoite ? "boites" : "boquets";
                
                if (occasionSlug === "amour" && style.slug !== "surprise-du-chef") {
                    let filename = style.slug;
                    if (filename === "purete") filename = "purte";
                    imgSrc = `/images/${folder}/amour/esprit/${filename}.jpeg`;
                } else if (occasionSlug === "anniversaire" && style.slug !== "surprise-du-chef") {
                    let filename = style.slug;
                    if (filename === "purete") filename = "pure";
                    const ext = (style.slug === "purete" || style.slug === "boheme") ? "png" : "jpeg";
                    imgSrc = `/images/${folder}/anniversaire/espirt/${filename}.${ext}`;
                }

                return (
                <button
                    key={style.id}
                    onClick={() => handleStyleClick(style)}
                    className="cursor-pointer group text-center"
                >
                    <div className={`h-32 ${style.color_code} rounded mb-2 group-hover:scale-105 transition shadow-sm flex items-center justify-center overflow-hidden relative`}>
                    {imgSrc ? (
                        <img src={imgSrc} className="absolute inset-0 w-full h-full object-cover" alt={style.label} />
                    ) : (
                        style.is_dark && <span className="text-white text-3xl font-serif">?</span>
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
