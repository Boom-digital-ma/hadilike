"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Settings,
  Star,
  Image as ImageIcon,
  FileText,
  Mail,
  Layout,
  LogOut,
  Flower2,
  ShieldAlert
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false); // Used to track super_admin status
  
  const supabase = getSupabaseBrowserClient();

    useEffect(() => {

      async function checkRole() {

          const { data: { user } } = await supabase.auth.getUser();

          if (user) {

              const { data, error } = await supabase.from('brand_admins').select('role').eq('user_id', user.id).single();

              if (data?.role === 'super_admin') {

                  setIsAdmin(true);

              }

          }

      }

      checkRole();

    }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Commandes", href: "/admin/orders", icon: ShoppingBag },
    { name: "Demandes", href: "/admin/leads", icon: Mail },
    { name: "Catégories", href: "/admin/categories", icon: Layout },
    { name: "Villes & Prix", href: "/admin/cities", icon: MapPin },
    { name: "Galerie & Médias", href: "/admin/gallery", icon: ImageIcon },
    { name: "Pages & Contenu", href: "/admin/pages", icon: FileText },
    { name: "Avis Clients", href: "/admin/reviews", icon: Star },
    { name: "Réglages", href: "/admin/settings", icon: Settings },
  ];

  // Don't show sidebar on login page
  if (pathname === "/admin") return <>{children}</>;

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-stone-100 flex items-center gap-2">
          <Flower2 className="text-black w-6 h-6" />
          <span className="font-serif text-xl font-bold tracking-tighter uppercase">Hadilike Admin</span>
        </div>

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
                    ? "bg-black text-white shadow-md" 
                    : "text-stone-500 hover:bg-stone-100 hover:text-black"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-100 space-y-2">
          {isAdmin && (
            <Link 
                href="/superadmin/brands"
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
                <ShieldAlert size={18} />
                Super Admin
            </Link>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
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