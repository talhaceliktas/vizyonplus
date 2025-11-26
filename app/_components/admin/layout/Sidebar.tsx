"use client";

import Link from "next/link";
import Image from "next/image";
import { redirect, usePathname } from "next/navigation";
import vizyonPLusLogo from "../../../../public/logo.png";
import {
  FaHome,
  FaFilm,
  FaPlusCircle,
  FaComments,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import supabaseBrowserClient from "../../../_lib/supabase/client";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Genel Bakış",
      href: "/admin",
      icon: <FaHome className="h-5 w-5" />,
    },
    {
      name: "İçerik Listesi",
      href: "/admin/icerikler",
      icon: <FaFilm className="h-5 w-5" />,
    },
    {
      name: "İçerik Ekle",
      href: "/admin/icerikEkle",
      icon: <FaPlusCircle className="h-5 w-5" />,
    },
    {
      name: "Yorum Yönetimi",
      href: "/admin/yorumlar",
      icon: <FaComments className="h-5 w-5" />,
    },
    {
      name: "Kullanıcılar",
      href: "/admin/kullanicilar",
      icon: <FaUsers className="h-5 w-5" />,
    },
    {
      name: "Ayarlar",
      href: "/admin/ayarlar",
      icon: <FaCog className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-neutral-800 bg-neutral-900 text-white transition-all duration-300">
      <div className="flex h-20 items-center justify-center border-b border-neutral-800">
        <Link href="/admin">
          <Image
            alt="Vizyon Plus Admin"
            src={vizyonPLusLogo}
            className="w-28"
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-primary-700 shadow-primary-900/20 text-white shadow-lg" // Aktif renk (senin primary rengine göre ayarla)
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-800 p-4">
        <button
          className="flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
          onClick={() => {
            supabaseBrowserClient.auth.signOut();
            redirect("giris");
          }}
        >
          <FaSignOutAlt className="h-5 w-5" />
          <span>Güvenli Çıkış</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
