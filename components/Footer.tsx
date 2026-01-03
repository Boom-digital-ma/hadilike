"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-stone-200 text-center pb-12 px-6 max-w-md mx-auto bg-brand-bg">
        <nav className="flex flex-wrap justify-center gap-4 text-xs text-stone-500 uppercase tracking-widest mb-6 font-sans">
            <Link href="/mentions-legales" className="hover:text-black transition">Mentions</Link>
            <Link href="/cgv" className="hover:text-black transition">CGV</Link>
            <Link href="/a-propos" className="hover:text-black transition">L'Atelier</Link>
            <Link href="/contact" className="hover:text-black transition">Contact</Link>
        </nav>
        <p className="text-[10px] text-stone-400 uppercase tracking-widest">
            Fait avec amour à Marrakech
        </p>
    </footer>
  );
}