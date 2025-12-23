"use client"; // Hook (usePathname) kullandığımız için Client Component olmalı

/**
 * Bu bileşen, profil sayfalarındaki sol taraftaki menüyü (Sidebar) oluşturur.
 * - Mobilde yatay scroll edilebilir bir menü,
 * - Masaüstünde dikey bir sidebar olarak görünür.
 * - Aktif sayfayı vurgular.
 */

import Link from "next/link";
import { usePathname } from "next/navigation"; // URL'i okumak için
import type { ReactNode } from "react";
import { FaRegHeart, FaStar, FaCreditCard } from "react-icons/fa6";
import { ImExit } from "react-icons/im";
import { LuCalendarClock } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";
import LogoutButton from "@/features/auth/components/LogoutButton";
import { History } from "lucide-react";

type MenuItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const ProfileSidebar = () => {
  const pathname = usePathname(); // Şu anki URL'i alır (örn: /profil/favoriler)

  const menuItems: MenuItem[] = [
    {
      href: "/profil", // Ana sayfa (Ayarlar)
      label: "Ayarlar",
      icon: <MdOutlineSettings />,
    },
    {
      href: "/profil/favoriler",
      label: "Favoriler",
      icon: <FaRegHeart />,
    },
    {
      href: "/profil/daha-sonra-izle",
      label: "Daha Sonra İzle",
      icon: <LuCalendarClock />,
    },
    {
      href: "/profil/puanlamalarim",
      label: "Puanlamalarım",
      icon: <FaStar />,
    },
    {
      href: "/profil/son-izlenilenler",
      label: "Son İzlenilenler",
      icon: <History />,
    },
    {
      href: "/profil/abonelikler",
      label: "Abonelik & Plan",
      icon: <FaCreditCard />,
    },
  ];

  return (
    <aside className="w-full shrink-0 md:w-72">
      {/* Container: Mobilde yatay scroll, masaüstünde dikey blok */}
      <div className="border-primary-800 bg-primary-900 scrollbar-hide sticky top-24 flex flex-row items-center gap-2 overflow-x-auto rounded-2xl border p-2 shadow-xl backdrop-blur-md md:flex-col md:overflow-visible md:p-4">
        {menuItems.map((item) => {
          // Aktiflik kontrolü: URL, linkin href'ine eşitse aktiftir.
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-1 flex-col items-center justify-center gap-y-1 rounded-xl p-3 text-center transition-all duration-200 md:w-full md:flex-row md:justify-start md:gap-x-4 md:px-4 md:py-3.5 md:text-left ${
                isActive
                  ? "bg-secondary-1/10 text-secondary-1 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                  : "text-primary-500 hover:bg-primary-800 hover:text-primary-50"
              }`}
            >
              <span
                className={`text-xl transition-transform duration-200 md:text-2xl ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium whitespace-nowrap md:text-base">
                {item.label}
              </span>

              {/* Masaüstünde aktiflik göstergesi (sağda nokta) */}
              {isActive && (
                <div className="bg-secondary-1 hidden h-1.5 w-1.5 rounded-full md:ml-auto md:block" />
              )}
            </Link>
          );
        })}

        <div className="bg-primary-800 hidden h-px w-full md:my-2 md:block" />

        {/* Çıkış Butonu */}
        <LogoutButton
          icon={<ImExit className="text-xl md:text-2xl" />}
          className="group flex flex-1 cursor-pointer items-center justify-between gap-y-1 rounded-xl p-3 text-center text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 md:w-full md:flex-row md:justify-start md:gap-x-4 md:px-4 md:py-3.5 md:text-left"
        >
          Çıkış Yap
        </LogoutButton>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
