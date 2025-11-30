import Link from "next/link";
import type { ReactNode } from "react";
import { FaRegHeart, FaStar } from "react-icons/fa6"; // FaStar eklendi
import { ImExit } from "react-icons/im";
import { LuCalendarClock } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";
import CikisYapButton from "../ui/CikisYapButton";

type MenuItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const ProfilYanMenu = ({ routeHref }: { routeHref: string }) => {
  // Menü elemanları listesi
  const menuItems: MenuItem[] = [
    {
      href: "/profil/favoriler",
      label: "Favoriler",
      icon: <FaRegHeart />,
    },
    {
      href: "/profil/dahaSonraIzle",
      label: "Daha Sonra İzle",
      icon: <LuCalendarClock />,
    },
    {
      href: "/profil/puanlamalarim", // YENİ ROTA
      label: "Puanlamalarım",
      icon: <FaStar />,
    },
    {
      href: "/profil/ayarlar",
      label: "Ayarlar",
      icon: <MdOutlineSettings />,
    },
  ];

  return (
    <aside className="w-full shrink-0 md:w-72">
      <div className="scrollbar-hide sticky top-24 flex flex-row items-center gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#121212] p-2 shadow-xl backdrop-blur-md md:flex-col md:overflow-visible md:p-4">
        {/* --- MENÜ LİNKLERİ --- */}
        {menuItems.map((item) => {
          const isActive = routeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-1 flex-col items-center justify-center gap-y-1 rounded-xl p-3 text-center transition-all duration-200 md:w-full md:flex-row md:justify-start md:gap-x-4 md:px-4 md:py-3.5 md:text-left ${
                isActive
                  ? "bg-yellow-500/10 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`text-xl transition-transform duration-200 md:text-2xl ${isActive ? "scale-110" : "group-hover:scale-110"}`}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium whitespace-nowrap md:text-base">
                {item.label}
              </span>

              {/* Aktiflik İşaretçisi (Sadece Desktop) */}
              {isActive && (
                <div className="hidden h-1.5 w-1.5 rounded-full bg-yellow-500 md:ml-auto md:block" />
              )}
            </Link>
          );
        })}

        {/* --- AYIRAÇ --- */}
        <div className="hidden h-px w-full bg-white/10 md:my-2 md:block" />

        {/* --- ÇIKIŞ YAP BUTONU --- */}
        <CikisYapButton
          href="/"
          icon={<ImExit className="text-xl md:text-2xl" />}
          className="group flex flex-1 items-center justify-between gap-y-1 rounded-xl p-3 text-center text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 md:w-full md:flex-row md:justify-start md:gap-x-4 md:px-4 md:py-3.5 md:text-left"
        >
          Çıkış Yap
        </CikisYapButton>
      </div>
    </aside>
  );
};

export default ProfilYanMenu;
