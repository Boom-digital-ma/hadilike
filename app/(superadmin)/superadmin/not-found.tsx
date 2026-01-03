import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SuperAdminNotFound() {
  return (
    <div className="fixed inset-0 z-[9999] bg-stone-900 flex flex-col items-center justify-center p-4 text-center text-white">
      <h1 className="font-serif text-[12rem] leading-none font-bold text-white/5 select-none absolute z-0 pointer-events-none">404</h1>
      
      <div className="relative z-10 space-y-6">
        <h2 className="font-serif text-4xl font-bold tracking-tight">Console SuperAdmin</h2>
        <h3 className="text-xl text-stone-400 font-medium uppercase tracking-widest">Zone Inconnue</h3>
        <p className="text-stone-500 max-w-sm mx-auto leading-relaxed">
            Erreur de routage dans l'infrastructure SAAS. Cette page n'existe pas.
        </p>
        
        <div className="pt-8">
            <Link 
                href="/superadmin" 
                className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-stone-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                <ArrowLeft size={20} />
                Retour au Panneau de Contrôle
            </Link>
        </div>
      </div>
      
      <div className="absolute bottom-10 text-[10px] text-stone-600 uppercase tracking-[0.3em] font-bold">
        Hadilike Cloud Infrastructure
      </div>
    </div>
  );
}
