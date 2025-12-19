import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ConceptSection from "@/components/ConceptSection";
import ProductCategories from "@/components/ProductCategories";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ConceptSection />
      
      <section className="py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif mb-8 italic uppercase tracking-widest">Collections Signature</h2>
          <ProductCategories />
        </div>
      </section>

      {/* Footer-like section for Marrakech Coverage */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-serif mb-8">L'Art de Vivre à Marrakech</h2>
          <p className="text-stone-400 max-w-2xl mx-auto mb-12">
            Nous couvrons Guéliz, l'Hivernage, la Médina, l'Agdal, la Palmeraie, Targa, et la route de l'Ourika. 
            Une carte message personnalisée est offerte pour chaque commande.
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-12 py-4 border border-secondary text-secondary hover:bg-secondary hover:text-primary transition-all duration-300 uppercase tracking-widest text-sm"
          >
            Nous Contacter
          </Link>
        </div>
      </section>
    </main>
  );
}
