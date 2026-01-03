"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Users, 
  Globe, 
  Activity,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  };

  const menuItems = [
    { name: "Marques", href: "/superadmin/brands", icon: Globe },
    { name: "Administrateurs", href: "/superadmin/users", icon: Users },
    { name: "Santé Plateforme", href: "/superadmin/health", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Super Sidebar - Pure Black theme */}
      <aside className="w-64 bg-brand-black text-white flex flex-col fixed h-full shadow-xl">
        <Link href="/superadmin" className="p-6 border-b border-white/5 flex items-center gap-2 hover:bg-white/5 transition-colors">
          <ShieldCheck className="text-white w-6 h-6" />
          <span className="font-serif text-lg font-bold tracking-tighter uppercase">Hadilike SAAS</span>
        </Link>

        <nav className="flex-grow p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-white text-black shadow-lg" 
                    : "text-stone-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 text-xs text-stone-500 hover:text-white transition">
            <ArrowLeft size={14} /> Retour Admin Boutique
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-10">
        {children}
      </main>
    </div>
  );
}