import Navbar from "@/components/Navbar";
import { MapPin, Phone, Instagram, ShieldCheck, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-40 pb-20 bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-serif text-primary mb-6 italic">L'Art du Contact</h1>
          <p className="text-stone-500 max-w-2xl mx-auto uppercase tracking-[0.2em] text-sm">
            Notre atelier à Marrakech est à votre entière disposition pour vos projets les plus audacieux.
          </p>
        </div>
      </section>

      <div className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Info Side */}
          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-serif mb-8 italic">Informations de l'Atelier</h2>
              <div className="space-y-8">
                <div className="flex gap-6 group">
                  <div className="p-5 bg-stone-900 text-secondary rounded-full h-fit transition-transform group-hover:scale-110">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Rayonnement</h3>
                    <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
                      Guéliz, Hivernage, Médina, Agdal, Palmeraie, Targa, route de l'Ourika.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="p-5 bg-stone-900 text-secondary rounded-full h-fit transition-transform group-hover:scale-110">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Conciergerie</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      +212 (0) 5 24 XX XX XX<br />
                      7j/7 – 09h00 à 19h00
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="p-5 bg-stone-900 text-secondary rounded-full h-fit transition-transform group-hover:scale-110">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Inspiration</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      @hadilike.marrakech
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-stone-900 text-white space-y-6">
              <ShieldCheck className="w-10 h-10 text-secondary" />
              <h3 className="font-serif text-2xl italic">Logistique Gants Blancs</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Chaque livraison est opérée par nos propres livreurs, formés spécifiquement à la manipulation et au transport de pièces florales fragiles et de grand format. 
                <span className="block mt-4 text-white italic">Votre composition arrive intacte, telle une œuvre d'art sortant de l'atelier.</span>
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 -z-10 rounded-full blur-3xl"></div>
            <div className="bg-white border border-stone-100 p-8 md:p-12 shadow-sm">
              <h2 className="text-2xl font-serif mb-10 italic">Une Attention Particulière</h2>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold group-focus-within:text-primary transition-colors">Nom Complet</label>
                    <input type="text" className="w-full bg-transparent border-b border-stone-200 py-4 focus:outline-none focus:border-primary transition-colors font-serif italic text-lg" placeholder="Ex: Jean-Luc" />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold group-focus-within:text-primary transition-colors">Votre Email</label>
                    <input type="email" className="w-full bg-transparent border-b border-stone-200 py-4 focus:outline-none focus:border-primary transition-colors font-serif italic text-lg" placeholder="contact@exemple.com" />
                  </div>
                </div>
                
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold group-focus-within:text-primary transition-colors">Nature de la demande</label>
                  <select className="w-full bg-transparent border-b border-stone-200 py-4 focus:outline-none focus:border-primary transition-colors appearance-none font-serif italic text-lg">
                    <option>Événement & Mariage</option>
                    <option>Composition Unique</option>
                    <option>Partenariat Riad & Hôtel</option>
                    <option>Autre demande</option>
                  </select>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold group-focus-within:text-primary transition-colors">Votre Message</label>
                  <textarea rows={4} className="w-full bg-transparent border-b border-stone-200 py-4 focus:outline-none focus:border-primary transition-colors resize-none font-serif italic text-lg" placeholder="Décrivez votre vision..."></textarea>
                </div>

                <div className="pt-4">
                  <button className="w-full bg-stone-900 text-white py-6 uppercase tracking-[0.3em] font-medium hover:bg-stone-800 transition-all duration-500 text-sm shadow-xl">
                    Envoyer à l'Atelier
                  </button>
                </div>
                
                <p className="text-[11px] text-stone-400 text-center italic mt-6">
                  * Nous joignons gracieusement une carte message calligraphiée à chacune de vos commandes sur simple demande.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
