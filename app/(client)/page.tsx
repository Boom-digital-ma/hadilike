"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PromoModal from "@/components/PromoModal";
import ReviewsSection from "@/components/ReviewsSection";
import { useBrand } from "@/context/BrandContext";

export default function HadilikeHome() {
  const router = useRouter();
  const { categories, settings } = useBrand();
  
  const promoConfig = settings?.promo_popup || { enabled: false };
  const [showPromo, setShowPromo] = useState(promoConfig.enabled);

  return (
    <div className="bg-brand-bg min-h-screen">
      <PromoModal isOpen={showPromo} onClose={() => setShowPromo(false)} />

      <main className="pt-24 pb-12 max-w-md mx-auto min-h-screen px-6 flex flex-col min-h-[80vh]">
        <div className="flex-grow">
            <h2 className="font-serif text-3xl text-center mb-2">L'Art Floral</h2>
            <p className="text-center text-stone-500 mb-8 text-sm uppercase tracking-widest">
              Marrakech
            </p>

            <div className="space-y-4">
              {/* Main Categories (Product Flows) -> Link to /[slug] */}
              {categories.filter(c => c.type === "product").map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}`}
                  className="block w-full group relative overflow-hidden h-32 rounded-lg bg-stone-200 shadow-sm transition hover:shadow-md"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition z-10">
                    <span className="font-serif text-xl text-white tracking-wide text-center px-4">
                      {cat.title}
                    </span>
                  </div>
                  <div 
                    className="w-full h-full bg-cover bg-center opacity-100 group-hover:scale-105 transition duration-700"
                    style={{ backgroundImage: `url('${cat.cover_image}')` }}
                  ></div>
                </Link>
              ))}

              {/* Service Categories (Contact Flows) -> Link to /services/ID */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {categories.filter(c => c.type === "service").map((svc) => (
                    <Link
                    key={svc.id}
                    href={`/services/${svc.slug}`}
                    className="block group relative overflow-hidden h-24 rounded-lg border border-stone-300 flex flex-col items-center justify-center transition"
                    >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition z-10"></div>
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-100 group-hover:scale-105 transition duration-700"
                        style={{ backgroundImage: `url('${svc.cover_image}')` }}
                    ></div>
                    <span className="relative z-20 font-serif text-lg text-white">{svc.title}</span>
                    {svc.subtitle && (
                      <span className="relative z-20 text-[10px] text-white/90 uppercase mt-1 tracking-wider">
                          {svc.subtitle}
                      </span>
                    )}
                    </Link>
                ))}
              </div>
            </div>
            
            {/* Reviews Section */}
            <ReviewsSection />
        </div>
      </main>
    </div>
  );
}
