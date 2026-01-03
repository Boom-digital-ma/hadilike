"use client";

import { useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Create a Supabase client for the browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert("Erreur de connexion : " + error.message);
        setLoading(false);
    } else {
        // Force refresh to update middleware state
        router.refresh();
        router.push("/admin/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-sm border border-stone-200">
      <h2 className="font-serif text-2xl text-center mb-6">Connexion Administration</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm text-stone-500 mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-stone-300 rounded focus:border-black outline-none"
            required 
          />
        </div>
        <div>
          <label className="block text-sm text-stone-500 mb-1">Mot de passe</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-stone-300 rounded focus:border-black outline-none"
            required 
          />
        </div>
        <button 
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded hover:bg-stone-800 transition disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
