"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toast, ToastType } from "@/components/Toast";
import { SHOP_CONFIG, PROMO_POPUP_CONFIG } from "@/data/shop-config";
import PromoModal from "@/components/PromoModal";
import ReviewsSection from "@/components/ReviewsSection";

export default function HadilikeHome() {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [showPromo, setShowPromo] = useState(PROMO_POPUP_CONFIG.enabled);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      <PromoModal isOpen={showPromo} onClose={() => setShowPromo(false)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="pt-24 pb-12 max-w-md mx-auto min-h-screen px-6 flex flex-col min-h-[80vh]">
        <div className="flex-grow animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-serif text-3xl text-center mb-2">L'Art Floral</h2>
            <p className="text-center text-stone-500 mb-8 text-sm uppercase tracking-widest">
              Marrakech
            </p>

            <div className="space-y-4">
              {/* Main Categories (Product Flows) -> Link to /[slug] */}
              {SHOP_CONFIG.filter(c => c.type !== "service").map((cat) => (
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
                    style={{ backgroundImage: `url('${cat.coverImage}')` }}
                  ></div>
                </Link>
              ))}

              {/* Service Categories (Contact Flows) -> Link to /services/ID */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {SHOP_CONFIG.filter(c => c.type === "service").map((svc) => (
                    <Link
                    key={svc.id}
                    href={`/services/${svc.id}`}
                    className="block group relative overflow-hidden h-24 rounded-lg border border-stone-300 flex flex-col items-center justify-center transition"
                    >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition z-10"></div>
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-100 group-hover:scale-105 transition duration-700"
                        style={{ backgroundImage: `url('${svc.coverImage}')` }}
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

        {/* === FOOTER === */}
        <footer className="mt-16 pt-8 border-t border-stone-200 text-center">
            <nav className="flex flex-wrap justify-center gap-4 text-xs text-stone-500 uppercase tracking-widest mb-6">
            <Link href="/mentions-legales" className="hover:text-black transition">Mentions</Link>
            <Link href="/cgv" className="hover:text-black transition">CGV</Link>
            <Link href="/a-propos" className="hover:text-black transition">L'Atelier</Link>
            <Link href="/contact" className="hover:text-black transition">Contact</Link>
            </nav>
            <p className="text-[10px] text-stone-400">
            Fait avec amour à Marrakech
            </p>
        </footer>
      </main>
    </div>
  );
}
