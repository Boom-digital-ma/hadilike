"use client";

import { Star } from "lucide-react";
import { useBrand } from "@/context/BrandContext";
import { getReviews } from "@/lib/api";
import { useState, useEffect } from "react";

export default function ReviewsSection() {
  const { brand, currentCity, settings } = useBrand();
  const [reviews, setReviews] = useState<any[]>([]);
  const config = settings?.reviews_config || { enabled: false };

  useEffect(() => {
    if (config.enabled && brand) {
      getReviews(brand.id, currentCity?.id).then(setReviews);
    }
  }, [brand, currentCity, config.enabled]);

  if (!config.enabled) return null;

  return (
    <div className="mt-20 mb-12">
      <div className="text-center mb-10">
        <h3 className="font-serif text-3xl mb-2 text-stone-900">{config.title}</h3>
        <div className="w-16 h-px bg-stone-300 mx-auto"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-stone-50 p-8 rounded-lg border border-stone-100 shadow-sm hover:shadow-md transition duration-300"
          >
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-stone-800 text-stone-800" />
              ))}
            </div>
            <p className="text-stone-600 text-sm italic mb-6 text-center leading-relaxed font-serif">
              "{review.content}"
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900 text-center">
              {review.author_name}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a 
          href={config.googleMapsLink}
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-3 bg-white border border-stone-200 text-stone-800 rounded-none text-xs uppercase tracking-[0.15em] hover:bg-stone-900 hover:text-white hover:border-stone-900 transition duration-300"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-3 h-3 opacity-60 grayscale hover:grayscale-0 transition" />
          <span>Lire tous les avis</span>
        </a>
      </div>
    </div>
  );
}
