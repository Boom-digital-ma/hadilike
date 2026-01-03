"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import ImageSlider from "@/components/ImageSlider";
import { useBrand } from "@/context/BrandContext";
import { useState, useEffect } from "react";
import { getOccasions, getGalleryImages } from "@/lib/api";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;
  const { setOrder } = useOrder();
  const { brand, categories } = useBrand();

  const [occasions, setOccasions] = useState<any[]>([]);
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const config = categories.find((c) => c.slug === categorySlug);

  useEffect(() => {
    if (config && brand) {
      // Ensure category is set in order context
      setOrder(prev => ({ ...prev, category: config.title }));

      Promise.all([
        getOccasions(brand.id, config.id),
        getGalleryImages(brand.id, config.id)
      ]).then(([occData, imgData]) => {
        setOccasions(occData);
        
        // Filter images: inspiration for top slider, best_seller for coups de coeur
        const sliders = imgData.filter(i => i.usage_type === 'inspiration' || i.usage_type === 'slider_hero').map(i => i.image_url);
        const best = imgData.filter(i => i.usage_type === 'best_seller');
        
        setSliderImages(sliders);
        setBestSellers(best);
        setLoading(false);
      });
    } else if (!config && categories.length > 0) {
        setLoading(false);
    }
  }, [config, brand, categories]);

  if (!loading && !config) {
    notFound();
  }

  if (loading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center font-serif">Chargement...</div>;

  const uiConfig = config.ui_config || {};

  const handleQuickBuy = (imgData: any) => {
    const specificConfig = imgData.target_config || {};
    setOrder({
        category: config.title,
        occasion: specificConfig.occasion || "Coup de Cœur",
        style: specificConfig.style || "Création du Chef",
        budget: imgData.price || uiConfig.quickBuyPrice || "650 DH",
        extras: [],
        specialRequest: "",
        message: "",
        date: "",
        slot: ""
    });
    const encodedImg = encodeURIComponent(imgData.image_url);
    router.push(`/commander/preview?img=${encodedImg}`);
  };

  const handleOccasionClick = (occ: any) => {
    setOrder(prev => ({ ...prev, category: config.title, occasion: occ.label }));
    router.push(`/${categorySlug}/${occ.slug}`);
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto">
      <Link href="/" className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Link>

      {/* Case 1: Direct Flow (Composition Spéciale) */}
      {config.flow === "direct" ? (
        <div className="space-y-8">
            {sliderImages.length > 0 && <ImageSlider images={sliderImages} />}

            <h3 className="font-serif text-3xl mb-2">{config.title}</h3>
            <p className="text-stone-500 italic text-sm mb-8">
              Laissez-vous inspirer par nos créations sur-mesure pour votre projet unique.
            </p>

            <div className="mb-8">
                <label className="block text-sm text-stone-500 uppercase tracking-widest mb-2">
                    {uiConfig.descriptionLabel || "Description"}
                </label>
                <textarea 
                    className="w-full p-4 border border-stone-200 rounded focus:border-black outline-none transition"
                    rows={5}
                    placeholder={uiConfig.descriptionPlaceholder || "Décrivez votre besoin..."}
                    onChange={(e) => setOrder(prev => ({ ...prev, category: config.title, specialRequest: e.target.value }))}
                ></textarea>
            </div>
            <button 
                onClick={() => router.push("/commander/budget")}
                className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition"
            >
                Continuer vers le budget
            </button>
        </div>
      ) : (
        /* Case 2: Standard Wizard Flow */
        <div className="space-y-8">
          {/* Quick Buy Slider */}
          {bestSellers.length > 0 && (
            <div className="mb-4">
                <h3 className="font-serif text-lg mb-3">Nos Coups de Cœur <span className="text-xs text-stone-400 font-sans tracking-widest ml-2 uppercase">Best-Sellers</span></h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
                {bestSellers.map((img, idx) => (
                    <button
                        key={img.id || idx}
                        onClick={() => handleQuickBuy(img)}
                        className="flex-shrink-0 w-24 aspect-square group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white border border-stone-100"
                    >
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${img.image_url}')` }}></div>
                        {img.price && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] py-1 text-center font-bold">
                                {img.price}
                            </div>
                        )}
                    </button>
                ))}
                </div>
            </div>
          )}

          <h3 className="font-serif text-2xl mb-6">Quelle est l'occasion ?</h3>
          <div className="grid grid-cols-2 gap-4">
            {occasions.map((occ) => (
            <button
                key={occ.id}
                onClick={() => handleOccasionClick(occ)}
                className="group flex flex-col gap-2 text-center"
            >
                <div className="relative w-full aspect-square rounded-lg border border-stone-200 overflow-hidden shadow-sm hover:border-black transition duration-300">
                <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition duration-700" 
                    style={{ backgroundImage: `url('${occ.image_url}')` }}
                ></div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <span className="text-stone-800 font-serif text-lg tracking-wide group-hover:text-black transition-colors">
                {occ.label}
                </span>
            </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
