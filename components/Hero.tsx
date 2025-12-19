import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Placeholder for Hero Image */}
      <div className="absolute inset-0 bg-stone-900">
        <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-4xl md:text-7xl font-serif text-white mb-6 leading-tight">
          L’Éclat de Marrakech : <br />
          <span className="italic">Créations Florales d'Exception</span>
        </h1>
        <p className="text-stone-200 text-lg md:text-xl font-sans mb-10 max-w-2xl mx-auto tracking-wide">
          L'élégance du "Chic Marrakech" livrée à votre porte. 
          Un artisanat floral raffiné pour sublimer vos plus beaux moments.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/collections" 
            className="px-8 py-4 bg-secondary text-primary font-medium rounded-full hover:bg-white transition-all duration-300 w-full sm:w-auto text-center uppercase tracking-widest text-sm"
          >
            Découvrir la Collection
          </Link>
          <Link 
            href="/sur-mesure" 
            className="px-8 py-4 border border-white text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 w-full sm:w-auto text-center uppercase tracking-widest text-sm"
          >
            Sur Mesure
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-px h-12 bg-white/40 mx-auto"></div>
      </div>
    </section>
  );
}
