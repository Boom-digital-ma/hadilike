import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[9999] bg-stone-50 flex flex-col items-center justify-center p-4 text-center">
      {/* Logo - Clean / No Style */}
      <div className="w-40 h-40 mb-12">
        <img 
            src="/images/logo-new.jpeg" 
            alt="Hadilike Logo" 
            className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>
      
      <h1 className="font-serif text-[12rem] leading-none font-bold text-stone-200 select-none absolute z-0 pointer-events-none">404</h1>
      
      <div className="relative z-10 space-y-6">
        <h2 className="font-serif text-4xl font-bold text-stone-900 tracking-tight">Page Introuvable</h2>
        <p className="text-stone-500 max-w-sm mx-auto leading-relaxed text-lg">
            Désolé, le bouquet que vous cherchez a peut-être été livré ailleurs ou n'existe plus.
        </p>
        
        <div className="pt-8">
            <Link 
                href="/" 
                className="inline-flex items-center gap-3 px-10 py-4 bg-black text-white rounded-full font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                <ArrowLeft size={20} />
                Retourner à la boutique
            </Link>
        </div>
      </div>
      
      <div className="absolute bottom-10 text-[10px] text-stone-300 uppercase tracking-[0.3em] font-bold">
        Hadilike Experience
      </div>
    </div>
  );
}