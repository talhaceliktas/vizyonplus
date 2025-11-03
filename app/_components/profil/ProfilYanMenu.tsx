import Link from "next/link";
import type { ReactNode } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { ImExit } from "react-icons/im";
import { LuCalendarClock } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";
import CikisYapButton from "../ui/CikisYapButton";

type ProfilYanType = {
  href: string;
  icon: ReactNode;
  children: ReactNode;
};

const ProfilYanMenu = ({ routeHref }: { routeHref: string }) => {
  const LayoutElement = ({ href, icon, children }: ProfilYanType) => {
    return (
      <Link
        href={href}
        className={`flex flex-col items-center gap-y-1 text-center transition-opacity duration-300 md:flex-row md:items-center md:gap-x-2 md:text-left ${
          routeHref === href ? "opacity-100" : "opacity-60 hover:opacity-100"
        }`}
      >
        <span className="text-2xl md:text-3xl">{icon}</span>
        <span className="text-xs font-medium md:text-2xl">{children}</span>
      </Link>
    );
  };

  return (
    <div className="text-primary-50 bg-primary-800/50 flex flex-row items-start justify-around gap-x-2 rounded-lg p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-sm md:flex-col md:items-start md:justify-start md:gap-y-6 md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:ring-0 md:backdrop-blur-none">
      <LayoutElement icon={<FaRegHeart />} href="/profil/favoriler">
        Favoriler
      </LayoutElement>
      <LayoutElement icon={<LuCalendarClock />} href="/profil/dahaSonraIzle">
        Daha sonra izle
      </LayoutElement>
      <LayoutElement icon={<MdOutlineSettings />} href="/profil/ayarlar">
        Ayarlar
      </LayoutElement>
      <CikisYapButton
        href="/"
        icon={<ImExit className="text-2xl md:text-3xl" />}
        className={`flex flex-col-reverse items-center gap-y-1 text-center opacity-60 transition-opacity duration-300 hover:opacity-100 md:ml-1 md:flex-row-reverse md:items-center md:gap-x-2 md:text-left`}
      >
        <p className="text-xs font-medium md:text-2xl">Çıkış Yap</p>
      </CikisYapButton>
    </div>
  );
};

export default ProfilYanMenu;
