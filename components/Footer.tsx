import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-serif text-2xl tracking-tighter mb-6 block">
              HADILIKE<span className="text-secondary">.MA</span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              L'art floral d'exception à Marrakech. 
              Livraison Gants Blancs pour vos moments les plus précieux.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-6 italic">Collections</h4>
            <ul className="space-y-4 text-stone-400 text-sm uppercase tracking-widest">
              <li><Link href="/collections/bouquets" className="hover:text-secondary transition-colors">Bouquets</Link></li>
              <li><Link href="/collections/boites-a-fleurs" className="hover:text-secondary transition-colors">Boîtes à Fleurs</Link></li>
              <li><Link href="/collections/compositions-speciales" className="hover:text-secondary transition-colors">Compositions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 italic">Services</h4>
            <ul className="space-y-4 text-stone-400 text-sm uppercase tracking-widest">
              <li><Link href="/evenements" className="hover:text-secondary transition-colors">Mariages</Link></li>
              <li><Link href="/evenements" className="hover:text-secondary transition-colors">Corporate</Link></li>
              <li><Link href="/sur-mesure" className="hover:text-secondary transition-colors">Sur Mesure</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 italic">Marrakech</h4>
            <ul className="space-y-4 text-stone-400 text-sm">
              <li>Guéliz & Hivernage</li>
              <li>La Palmeraie</li>
              <li>Médina & Agdal</li>
              <li>Route de l'Ourika</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-stone-800 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-stone-500 text-xs uppercase tracking-widest">
            © 2025 Hadilike.ma - Tous droits réservés.
          </p>
          <div className="flex gap-8 text-stone-500 text-xs uppercase tracking-widest">
            <Link href="/mentions-legales" className="hover:text-secondary">Mentions Légales</Link>
            <Link href="/cgv" className="hover:text-secondary">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
