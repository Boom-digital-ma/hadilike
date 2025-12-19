import Navbar from "@/components/Navbar";
import { Palette, MessageSquare, PenTool } from "lucide-react";
import Link from "next/link";

export default function SurMesurePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-stone-900/40"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">L'Art du Sur-Mesure</h1>
          <p className="text-stone-100 text-lg md:text-xl font-sans max-w-2xl mx-auto uppercase tracking-widest">
            Votre vision, notre savoir-faire floral
          </p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-serif text-primary mb-6">Créez l'Unique</h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Parce que certaines émotions ne rentrent pas dans des cases, Hadilike vous offre la liberté de composer. 
              Que vous ayez une idée précise ou juste une envie de couleur, nos artisans fleuristes à Marrakech matérialisent votre pensée.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-stone-50 p-3 rounded-full h-fit">
                  <Palette className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1">Choix de la Palette</h3>
                  <p className="text-stone-500 text-sm">Monochrome chic, duo contrasté ou explosion multicolore. Vous décidez des teintes.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-stone-50 p-3 rounded-full h-fit">
                  <PenTool className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1">Architecture Florale</h3>
                  <p className="text-stone-500 text-sm">Bouquet rond compact, déstructuré champêtre, ou composition haute en vase.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-stone-50 p-3 rounded-full h-fit">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1">Message Personnel</h3>
                  <p className="text-stone-500 text-sm">Accompagnez votre création d'une carte manuscrite calligraphiée.</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link 
                href="/contact" 
                className="inline-block px-10 py-4 bg-primary text-white uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors"
              >
                Commander une Création Unique
              </Link>
            </div>
          </div>

          <div className="relative h-[600px] bg-stone-100">
             <img 
               src="https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=1000&auto=format&fit=crop" 
               alt="Fleuriste au travail" 
               className="absolute inset-0 w-full h-full object-cover"
             />
          </div>
        </div>
      </section>
    </main>
  );
}
