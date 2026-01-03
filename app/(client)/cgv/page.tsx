"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useBrand } from "@/context/BrandContext";
import { getPage } from "@/lib/api";

export default function CGVPage() {
  const { brand } = useBrand();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brand) {
      getPage(brand.id, 'cgv').then(data => {
        setPage(data);
        setLoading(false);
      });
    }
  }, [brand]);

  if (loading) return <div className="min-h-screen pt-32 text-center animate-pulse font-serif text-stone-400">Chargement...</div>;

  return (
    <div className="bg-brand-bg pt-32 pb-20 px-6 max-w-md mx-auto">
      <Link href="/" className="inline-flex items-center text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Link>

      <h1 className="font-serif text-3xl mb-6">{page?.title || "Conditions Générales de Vente"}</h1>
      
      <div className="prose prose-stone prose-sm">
        <p className="whitespace-pre-line text-stone-600 leading-relaxed">
            {page?.content || "Contenu à venir."}
        </p>
      </div>
    </div>
  );
}