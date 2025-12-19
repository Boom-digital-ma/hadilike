import Link from "next/link";

const categories = [
  {
    title: "BOUQUETS",
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=2000&auto=format&fit=crop",
    href: "/collections/bouquets",
  },
  {
    title: "BOÎTES À FLEURS",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0fab?q=80&w=2000&auto=format&fit=crop",
    href: "/collections/boites-a-fleurs",
  },
  {
    title: "COMPOSITIONS SPÉCIALES",
    image: "https://images.unsplash.com/photo-1520330055272-359286460334?q=80&w=2000&auto=format&fit=crop",
    href: "/collections/compositions-speciales",
  },
];

export default function ProductCategories() {
  return (
    <section className="py-12 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.title} href={cat.href} className="group relative h-[600px] overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image})` }}
              ></div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border border-white/40 p-8 backdrop-blur-sm">
                  <h3 className="text-white text-2xl font-serif tracking-[0.2em]">{cat.title}</h3>
                  <div className="w-12 h-px bg-white mx-auto mt-4 transition-all duration-300 group-hover:w-full"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
