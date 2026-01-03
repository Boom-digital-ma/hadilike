"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUploader({ onUploadSuccess, folder = "gallery", label = "Uploader une image" }: ImageUploaderProps) {
  const [uploading, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSubmitting(true);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("Vous devez sélectionner une image à uploader.");
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUploadSuccess(publicUrl);
      
    } catch (error: any) {
      alert("Erreur d'upload: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">{label}</label>
      
      <div className="relative border-2 border-dashed border-stone-200 rounded-xl p-4 transition-colors hover:border-black group bg-stone-50/50">
        {preview ? (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-stone-200">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={() => { setPreview(null); onUploadSuccess(""); }}
              className="absolute top-2 right-2 p-1.5 bg-black text-white rounded-full shadow-lg hover:bg-red-600 transition"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-stone-300 group-hover:text-black transition-colors mb-2" />
                <span className="text-xs text-stone-500 font-medium">Cliquez pour choisir un fichier</span>
                <span className="text-[9px] text-stone-400 uppercase mt-1 tracking-widest">JPG, PNG, WEBP</span>
              </>
            )}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleUpload} 
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
