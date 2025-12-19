import Navbar from "@/components/Navbar";
import { products } from "@/data/products";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";

// Helper to match URL slug to Category Name
const categoryMap: Record<string, string> = {
  "bouquets": "Bouquets",
  "boites-a-fleurs": "Boîtes à Fleurs",
  "compositions-speciales": "Compositions Spéciales"
};

export default function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const categoryName = categoryMap[resolvedParams.category];

  if (!categoryName) {
    notFound();
  }

  const categoryProducts = products.filter(p => p.category === categoryName);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">{categoryName}</h1>
          <div className="w-24 h-px bg-secondary mx-auto"></div>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {categoryProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-stone-100 mb-6 relative">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm uppercase tracking-widest">Voir le détail</span>
                  </div>
                </div>
                <h3 className="text-lg font-serif text-primary mb-2 group-hover:text-secondary transition-colors">
                  {product.name}
                </h3>
                <p className="text-stone-500 font-sans text-sm mb-3 line-clamp-2">
                  {product.shortDescription}
                </p>
                <div className="text-primary font-medium">
                  {product.price} DH
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-stone-50 rounded-lg">
            <h3 className="font-serif text-xl text-stone-400 mb-4">Collection en cours de création</h3>
            <p className="text-stone-500">Nos artisans fleuristes préparent de nouvelles créations pour cette collection.</p>
            <Link href="/" className="inline-block mt-8 text-secondary border-b border-secondary pb-1 hover:text-primary hover:border-primary transition-all">
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
