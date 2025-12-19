import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-serif text-2xl tracking-tighter text-primary">
              HADILIKE<span className="text-secondary">.MA</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/collections/bouquets" className="text-sm font-medium hover:text-secondary transition-colors uppercase tracking-widest">Bouquets</Link>
            <Link href="/collections/boites-a-fleurs" className="text-sm font-medium hover:text-secondary transition-colors uppercase tracking-widest">Boîtes à Fleurs</Link>
            <Link href="/collections/compositions-speciales" className="text-sm font-medium hover:text-secondary transition-colors uppercase tracking-widest">Compositions</Link>
            <Link href="/sur-mesure" className="text-sm font-medium hover:text-secondary transition-colors uppercase tracking-widest">Sur Mesure</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-secondary transition-colors uppercase tracking-widest">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:text-secondary transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button className="md:hidden p-2 hover:text-secondary transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
