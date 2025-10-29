import Link from "next/link";
import { FaRegHeart } from "react-icons/fa6";
import { ImExit } from "react-icons/im";
import { IoHomeOutline } from "react-icons/io5";
import { LuCalendarClock } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";

const ProfilYanMenu = ({ routeHref }) => {
  const LayoutElement = ({ href, icon, children }) => {
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
    <div className="flex flex-col gap-y-6 text-2xl">
      <LayoutElement icon={<IoHomeOutline />} href="/profil">
        Anasayfa
      </LayoutElement>
      <LayoutElement icon={<FaRegHeart />} href="/profil/favoriler">
        Favoriler
      </LayoutElement>
      <LayoutElement icon={<LuCalendarClock />} href="/profil/dahaSonraIzle">
        Daha sonra izle
      </LayoutElement>
      <LayoutElement icon={<MdOutlineSettings />} href="/profil/ayarlar">
        Ayarlar
      </LayoutElement>
      <LayoutElement icon={<ImExit />} href="/profil/cikisyap">
        Çıkış yap
      </LayoutElement>
    </div>
  );
};

export default ProfilYanMenu;
