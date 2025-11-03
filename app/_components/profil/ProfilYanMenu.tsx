import Link from "next/link";
import type { ReactNode } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { ImExit } from "react-icons/im";
import { IoHomeOutline } from "react-icons/io5";
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
        className={`flex items-center gap-x-2 ${routeHref === href ? "" : "opacity-60"}`}
      >
        <span className="text-3xl">{icon}</span>
        {children}
      </Link>
    );
  };

  return (
    <div className="text-primary-50 flex flex-col gap-y-6 text-2xl duration-300">
      {/* Anasayfa eklenene kadar tasarimdan kaldirildi! */}
      {/* <LayoutElement icon={<IoHomeOutline />} href="/profil">
        Anasayfa
      </LayoutElement> */}
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
        icon={<ImExit />}
        className={`ml-1 flex flex-row-reverse items-center justify-end gap-x-2 text-3xl opacity-60 duration-300 hover:opacity-100`}
      >
        <p className="text-2xl">Çıkış Yap</p>
      </CikisYapButton>
    </div>
  );
};

export default ProfilYanMenu;
