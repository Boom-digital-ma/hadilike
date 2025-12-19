import { MapPin, Truck, Sparkles } from "lucide-react";

export default function ConceptSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-primary mb-4">Le Concept Hadilike</h2>
          <div className="w-24 h-px bg-secondary mx-auto mb-6"></div>
          <p className="text-stone-500 max-w-2xl mx-auto font-sans">
            Plus qu'une boutique de fleurs, une expérience sensorielle ancrée dans le luxe et la tradition de Marrakech.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="mb-6 inline-flex p-4 rounded-full bg-stone-50 group-hover:bg-stone-100 transition-colors">
              <Truck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-serif mb-3 uppercase tracking-wider">Livraison "Gants Blancs"</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Une logistique d'exception pour des pièces fragiles. Nos livreurs sont formés au transport de luxe sur Guéliz, l’Hivernage et la Palmeraie.
            </p>
          </div>

          <div className="text-center group">
            <div className="mb-6 inline-flex p-4 rounded-full bg-stone-50 group-hover:bg-stone-100 transition-colors">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-serif mb-3 uppercase tracking-wider">Créations à la Demande</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Pour garantir une fraîcheur absolue, chaque composition est réalisée à la main dans notre atelier de Marrakech juste avant son départ.
            </p>
          </div>

          <div className="text-center group">
            <div className="mb-6 inline-flex p-4 rounded-full bg-stone-50 group-hover:bg-stone-100 transition-colors">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-serif mb-3 uppercase tracking-wider">Ancrage Local</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Inspiré par l'architecture des villas de la Palmeraie et le raffinement de l'Hivernage. Un design qui raconte Marrakech.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
