"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { PROMO_POPUP_CONFIG } from "@/data/shop-config";
import Link from "next/link";

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromoModal({ isOpen, onClose }: PromoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal Content */}
      <div className="relative bg-white w-full h-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-30 p-2 bg-black/10 rounded-full hover:bg-black/20 transition backdrop-blur-md"
        >
          <X size={32} className="text-white md:text-stone-800" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
            {/* Image Section */}
            <div className="w-full md:w-3/5 h-[50vh] md:h-full relative">
                 <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${PROMO_POPUP_CONFIG.image}')` }}
                  >
                    <div className="absolute inset-0 bg-black/10 md:hidden"></div>
                  </div>
            </div>

            {/* Text/Content Section */}
            <div className="w-full md:w-2/5 p-12 md:p-20 flex flex-col justify-center bg-white h-[50vh] md:h-full">
                <div className="max-w-sm mx-auto md:mx-0">
                  {PROMO_POPUP_CONFIG.subtitle && (
                    <span className="text-stone-500 uppercase tracking-[0.3em] text-xs mb-4 block">
                      {PROMO_POPUP_CONFIG.subtitle}
                    </span>
                  )}
                  <h3 className="font-serif text-5xl md:text-7xl mb-8 text-stone-900 leading-tight">
                    {PROMO_POPUP_CONFIG.title}
                  </h3>
                  <p className="text-stone-600 mb-12 font-sans text-lg leading-relaxed">
                      {PROMO_POPUP_CONFIG.description}
                  </p>
                  
                  {PROMO_POPUP_CONFIG.link ? (
                    <Link href={PROMO_POPUP_CONFIG.link} onClick={onClose} className="block w-full md:w-auto">
                        <button className="w-full px-12 bg-stone-900 text-white py-5 rounded-full font-serif text-xl hover:bg-stone-800 transition shadow-xl">
                            {PROMO_POPUP_CONFIG.buttonText}
                        </button>
                    </Link>
                  ) : (
                    <button 
                        onClick={onClose}
                        className="w-full md:w-auto px-12 bg-stone-900 text-white py-5 rounded-full font-serif text-xl hover:bg-stone-800 transition shadow-xl"
                    >
                        {PROMO_POPUP_CONFIG.buttonText}
                    </button>
                  )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
