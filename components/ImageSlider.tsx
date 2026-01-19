"use client";

import { useState, useEffect } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  autoPlay?: boolean;
  allowZoom?: boolean;
}

export default function ImageSlider({ images, autoPlay = true, allowZoom = false }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length <= 1 || isLightboxOpen) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, [images, autoPlay, isLightboxOpen]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  if (!images || images.length === 0) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const openLightbox = (index: number) => {
    if (!allowZoom) return;
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const prevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <>
      <div className="w-full h-64 md:h-80 rounded-lg mb-8 overflow-hidden relative group">
        {images.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            } ${allowZoom ? "cursor-zoom-in" : ""}`}
            onClick={() => openLightbox(index)}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {allowZoom ? (
                 <>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                        <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition transform scale-75 group-hover:scale-100" />
                    </div>
                    {/* Permanent indicator for mobile/visibility */}
                    <div className="absolute top-3 right-3 bg-black/30 text-white p-2 rounded-full backdrop-blur-md z-20 pointer-events-none">
                        <ZoomIn size={16} />
                    </div>
                 </>
            ) : (
                 <div className="absolute inset-0 bg-black/20"></div>
            )}
          </div>
        ))}
        
        {/* Manual Controls (Main Slider) */}
        {images.length > 1 && (
            <>
                <button 
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight size={20} />
                </button>
            </>
        )}

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
            <button 
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition z-50 bg-black/50 p-2 rounded-full"
            >
                <X size={24} />
            </button>

            <div className="relative w-full max-w-5xl h-[85vh] flex items-center justify-center px-4 md:px-12">
                 <button 
                    onClick={prevLightbox}
                    className="absolute left-2 md:left-4 text-white/70 hover:text-white transition p-3 bg-black/20 hover:bg-black/40 rounded-full"
                >
                    <ChevronLeft size={32} />
                </button>
                
                <img 
                    src={images[lightboxIndex]} 
                    alt="Zoom" 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />

                <button 
                    onClick={nextLightbox}
                    className="absolute right-2 md:right-4 text-white/70 hover:text-white transition p-3 bg-black/20 hover:bg-black/40 rounded-full"
                >
                    <ChevronRight size={32} />
                </button>
            </div>
            
            <div className="absolute bottom-8 left-0 right-0 text-center text-white/50 font-serif text-sm tracking-widest">
                {lightboxIndex + 1} / {images.length}
            </div>
        </div>
      )}
    </>
  );
}
