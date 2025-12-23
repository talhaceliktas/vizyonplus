"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import vizyonPLusLogo from "@public/logo.png";
import supabaseClient from "@lib/supabase/client";
import { ADMIN_MENU_ITEMS } from "../constants";

// BU DOSYA NE İŞE YARAR?
// Yönetim paneli sol menüsüdür (Sidebar).
// Sadece admin sayfalarında (/admin/...) görünür.

const AdminSidebar = () => {
  const pathname = usePathname(); // O anki URL
  const router = useRouter(); // Yönlendirme (Logout sonrası)

  const handleLogout = async () => {
    // Supabase oturumunu kapat
    await supabaseClient.auth.signOut();
    toast.success("Güvenli çıkış yapıldı");

    // Login sayfasına yönlendir ve sayfayı yenile (State temizliği için)
    router.push("/giris");
    router.refresh();
  };

  return (
    <aside className="fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-neutral-800 bg-neutral-900 text-white transition-all duration-300">
      {/* Logo Alanı */}
      <div className="flex h-20 items-center justify-center border-b border-neutral-800">
        <Link href="/admin">
          <Image
            alt="Vizyon Plus Admin"
            src={vizyonPLusLogo}
            className="w-28 object-contain"
            priority
          />
        </Link>
      </div>

      {/* Menü Linkleri */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {ADMIN_MENU_ITEMS.map((item) => {
          // Aktif Link Kontrolü (Hangi sayfadayız?)
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" // Aktifse Mavi
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white" // Değilse Gri
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Alt Kısım: Çıkış Yap */}
      <div className="border-t border-neutral-800 p-4">
        <button
          className="flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="h-5 w-5" />
          <span>Güvenli Çıkış</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
