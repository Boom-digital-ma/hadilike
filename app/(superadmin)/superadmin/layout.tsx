"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Users, 
  Globe, 
  Activity,
  LogOut,
  ArrowLeft,
  Menu,
  X
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const supabase = getSupabaseBrowserClient();

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

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
    <div className="min-h-screen bg-stone-50 flex flex-col lg:flex-row">
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-brand-black text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-white w-6 h-6" />
          <span className="font-serif text-lg font-bold tracking-tighter uppercase">Hadilike SAAS</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2 hover:bg-white/10 rounded-lg active:scale-95 transition"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Super Sidebar - Pure Black theme */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-brand-black text-white flex flex-col h-full shadow-2xl lg:shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
      `}>
        <div className="flex items-center justify-between border-b border-white/5">
            <Link href="/superadmin" className="p-6 flex items-center gap-2 hover:bg-white/5 transition-colors flex-grow">
                <ShieldCheck className="text-white w-6 h-6" />
                <span className="font-serif text-lg font-bold tracking-tighter uppercase">Hadilike SAAS</span>
            </Link>
            <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="lg:hidden p-4 text-stone-400 hover:text-white transition"
            >
                <X size={24} />
            </button>
        </div>

        <nav className="flex-grow p-4 space-y-2 mt-4 overflow-y-auto">
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

        <div className="p-4 border-t border-white/5 space-y-2 bg-black/20">
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
      <main className="flex-grow p-4 lg:p-10 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}