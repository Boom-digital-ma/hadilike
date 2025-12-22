import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CGV() {
  return (
    <main className="pt-32 pb-12 px-6 max-w-2xl mx-auto min-h-screen">
      <Link href="/" className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span className="text-sm uppercase tracking-wide">Retour à l'accueil</span>
      </Link>

      <h1 className="font-serif text-3xl mb-8">Conditions Générales de Vente</h1>
      <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
        <h2 className="font-serif text-xl text-black mt-6">1. Objet</h2>
        <p>Les présentes conditions régissent les ventes de compositions florales par la société Hadilike à Marrakech.</p>

        <h2 className="font-serif text-xl text-black mt-6">2. Prix</h2>
        <p>Les prix de nos produits sont indiqués en Dirhams (DH) toutes taxes comprises (TTC).</p>

        <h2 className="font-serif text-xl text-black mt-6">3. Commandes</h2>
        <p>Toute confirmation de commande entraîne votre adhésion pleine et entière aux présentes conditions générales de vente, sans exception ni réserve.</p>
        
        <h2 className="font-serif text-xl text-black mt-6">4. Livraison</h2>
        <p>Les produits sont livrés à l'adresse de livraison indiquée au cours du processus de commande, dans la zone de Marrakech spécifiée (Guéliz, Hivernage, Palmeraie, etc.).</p>
      </div>
    </main>
  );
}
