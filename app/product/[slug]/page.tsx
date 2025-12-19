import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import { Clock, Truck, ShieldCheck, Heart } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const product = products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] relative overflow-hidden bg-stone-100">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square relative overflow-hidden bg-stone-100">
                  <img 
                    src={img} 
                    alt={`${product.name} detail ${i + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <nav className="text-xs uppercase tracking-widest text-stone-400 mb-4">
              {product.category}
            </nav>
            <h1 className="text-3xl md:text-5xl font-serif text-primary mb-6 leading-tight">
              {product.name}
            </h1>
            
            <div className="text-2xl font-sans text-primary mb-8">
              {product.price} DH <span className="text-sm text-stone-400 font-normal">TTC</span>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <span>En stock (Création à la demande pour garantir la fraîcheur)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <Clock className="w-5 h-5 text-secondary" />
                <span>Disponible pour livraison aujourd'hui pour toute commande avant 14h00</span>
              </div>
            </div>

            <p className="text-stone-600 leading-relaxed mb-8">
              {product.shortDescription}
            </p>

            <div className="flex gap-4 mb-12">
              <button className="flex-1 bg-secondary text-primary py-5 px-8 uppercase tracking-[0.2em] font-medium hover:bg-stone-300 transition-colors">
                Ajouter au Panier
              </button>
              <button className="p-5 border border-stone-200 hover:bg-stone-50 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <div className="border-t border-stone-100 pt-8 space-y-8">
              <div>
                <h3 className="font-serif text-lg mb-4 italic">L'Histoire de cette Création</h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {product.storytelling}
                </p>
              </div>

              <div>
                <h3 className="font-serif text-lg mb-4 italic">Conseils d'Entretien</h3>
                <div className="bg-stone-50 p-6 border-l-2 border-secondary">
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {product.maintenance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Long Description Section */}
        <section className="mt-24 py-24 border-t border-stone-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif mb-8">Une Touche de Luxe Pur pour Votre Intérieur</h2>
            <p className="text-stone-500 leading-relaxed mb-12 text-lg">
              {product.longDescription}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {product.features.map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                  <p className="text-stone-700 font-medium tracking-wide">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gants Blancs Section */}
        <section className="bg-primary text-white p-12 md:p-20 text-center">
          <Truck className="w-12 h-12 mx-auto mb-6 text-secondary" />
          <h2 className="text-2xl font-serif mb-4 uppercase tracking-widest">Service Gants Blancs</h2>
          <p className="text-stone-400 max-w-xl mx-auto text-sm">
            Nos livreurs sont spécifiquement formés pour le transport de pièces fragiles. 
            Votre composition arrive intacte, prête à être admirée.
          </p>
        </section>
      </div>
    </main>
  );
}
