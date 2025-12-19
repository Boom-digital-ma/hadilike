import Navbar from "@/components/Navbar";
import { Sparkles, Calendar, GlassWater } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-7xl font-serif text-white mb-6">Événements & Sur-mesure</h1>
          <p className="text-stone-200 text-lg md:text-xl font-sans max-w-2xl mx-auto uppercase tracking-widest">
            Sublimer vos instants d'exception à Marrakech
          </p>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif mb-8 italic">Des œuvres d'art vivantes</h2>
          <p className="text-stone-500 max-w-3xl mx-auto text-lg leading-relaxed">
            Sortez du bouquet traditionnel. Pour vos mariages, réceptions en villa ou événements corporate, nous concevons des scénographies florales qui racontent une histoire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="aspect-[3/4] overflow-hidden bg-stone-100">
              <img src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1000" alt="Mariages" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-serif">Mariages & Cérémonies</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              De la Palmeraie aux jardins de l'Hivernage, nous créons l'atmosphère de votre grand jour avec raffinement.
            </p>
          </div>

          <div className="space-y-6">
            <div className="aspect-[3/4] overflow-hidden bg-stone-100">
              <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000" alt="Entreprises" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-serif">Corporate & Riad</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Abonnements floraux pour hôtels de luxe, riads et entreprises souhaitant une image prestigieuse.
            </p>
          </div>

          <div className="space-y-6">
            <div className="aspect-[3/4] overflow-hidden bg-stone-100">
              <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000" alt="Sur-mesure" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-serif">Design Résidentiel</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Transformez votre intérieur avec des compositions pensées comme des objets de décoration pérennes.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stone-900 py-24 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-12 h-12 text-secondary mx-auto mb-8" />
          <h2 className="text-3xl md:text-4xl font-serif mb-8 italic">Donnez vie à vos projets</h2>
          <p className="text-stone-400 mb-12 text-lg">
            Chaque projet commence par une conversation. Contactez notre équipe pour une étude personnalisée de votre événement.
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-12 py-5 bg-secondary text-primary uppercase tracking-[0.2em] font-medium hover:bg-white transition-all"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </section>
    </main>
  );
}
