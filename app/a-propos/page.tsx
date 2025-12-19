import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function APropos() {
  return (
    <main className="pt-24 pb-12 px-6 max-w-2xl mx-auto min-h-screen">
      <Link href="/" className="flex items-center gap-2 text-stone-500 mb-8 hover:text-black transition">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>
      <h1 className="font-serif text-3xl mb-8">L'Atelier Hadilike</h1>
      
      <div className="aspect-video bg-stone-200 w-full mb-8 rounded overflow-hidden">
        <img src="/images/atelier.jpeg" className="w-full h-full object-cover" alt="Atelier fleuriste" />
      </div>

      <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
        <p>
          Hadilike est né d'une passion pour l'art floral et l'amour de Marrakech. 
          Nous ne vendons pas simplement des fleurs, nous créons des émotions.
        </p>
        <p>
          Situé au cœur de Guéliz, notre atelier travaille exclusivement avec des producteurs locaux et des fleurs d'importation de premier choix (Hollande, Équateur) pour garantir une fraîcheur et une tenue exceptionnelles.
        </p>
        <p>
          Notre signature "Gants Blancs" est la promesse d'un service irréprochable, du choix de la tige à la remise en main propre à votre destinataire.
        </p>
      </div>
    </main>
  );
}
