"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SHOP_CONFIG } from "@/data/shop-config";
import { useOrder } from "@/context/OrderContext";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;
  const { setOrder, resetOrder } = useOrder();

  const config = SHOP_CONFIG.find((c) => c.slug === categorySlug);

  if (!config) {
    notFound();
  }

  // Handle Quick Buy Click
  const handleQuickBuy = (imgSrc: string) => {
    // For quick buy, we might want a specific URL or just use context?
    // User wanted "friendly routing".
    // Quick buy skips selection. Ideally it goes to a checkout page.
    // Let's assume we go to a checkout page /commander with params?
    // Or we keep using the context wizard for the final steps.
    // Let's navigate to /commander which we will create for the final steps (Budget -> Details).
    
    setOrder({
        category: config.id,
        occasion: "Coup de Cœur",
        style: "Création du Chef",
        budget: config.quickBuyPrice || "",
        extras: [],
        specialRequest: "",
        message: "",
        date: "",
        slot: ""
    });
    
    // We pass the image via query param or context. Context is set above.
    // But wait, the preview page showed the image.
    // Let's create a special route for quick buy preview?
    // /commander/preview?img=...
    const encodedImg = encodeURIComponent(imgSrc);
    router.push(`/commander/preview?img=${encodedImg}`);
  };

  const handleOccasionClick = (occ: any) => {
    // Navigate to [category]/[occasion]
    setOrder(prev => ({ ...prev, category: config.id, occasion: occ.label }));
    router.push(`/${categorySlug}/${occ.slug}`);
  };

  // Direct Flow (Composition Spéciale)
  if (config.flow === "direct") {
     // This page acts as the form.
     // On submit, go to budget?
     // Let's reuse the logic: Description -> Budget -> Details.
     // We can do this in /commander/custom?
     // Or just keep it here and navigate to /commander/budget after description.
     return (
        <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
            <Link href="/" className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Link>
            
            <h3 className="font-serif text-2xl mb-6">{config.title}</h3>
            <div className="mb-8">
                <label className="block text-sm text-stone-500 uppercase tracking-widest mb-2">
                    {config.descriptionLabel || "Description"}
                </label>
                <textarea 
                    className="w-full p-4 border border-stone-200 rounded focus:border-black outline-none transition"
                    rows={5}
                    placeholder={config.descriptionPlaceholder || "Décrivez votre besoin..."}
                    onChange={(e) => setOrder(prev => ({ ...prev, category: config.id, specialRequest: e.target.value }))}
                ></textarea>
            </div>
            <button 
                onClick={() => router.push("/commander/budget")}
                className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition"
            >
                Continuer vers le budget
            </button>
        </div>
     );
  }

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-12 px-6 max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <Link href="/" className="inline-flex items-center text-stone-500 hover:text-black mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Link>

      {/* Quick Buy Slider */}
      {config.bestSellers && config.bestSellers.length > 0 && (
        <div className="mb-4">
            <h3 className="font-serif text-lg mb-3">Nos Coups de Cœur <span className="text-xs text-stone-400 font-sans tracking-widest ml-2 uppercase">Best-Sellers</span></h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
            {config.bestSellers.map((imgSrc, idx) => (
                <button
                    key={idx}
                    onClick={() => handleQuickBuy(imgSrc)}
                    className="flex-shrink-0 w-24 aspect-square group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white border border-stone-100"
                >
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${imgSrc}')` }}></div>
                </button>
            ))}
            </div>
        </div>
      )}

      <h3 className="font-serif text-2xl mb-6">Quelle est l'occasion ?</h3>
      <div className="grid grid-cols-2 gap-4">
        {config.occasions?.map((occ) => (
        <button
            key={occ.id}
            onClick={() => handleOccasionClick(occ)}
            className="group flex flex-col gap-2 text-center"
        >
            <div className="relative w-full aspect-square rounded-lg border border-stone-200 overflow-hidden shadow-sm hover:border-black transition duration-300">
            <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition duration-700" 
                style={{ backgroundImage: `url('${occ.image}')` }}
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
  );
}
