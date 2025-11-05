"use client";

import Link from "next/link";
import Image from "next/image";
import { ImExit } from "react-icons/im";
import { FaUser } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import { VscSignIn } from "react-icons/vsc";
import CikisYapButton from "./ui/CikisYapButton";
import { User } from "@supabase/supabase-js";

const AsagiAcilirMenu = ({
  user,
  profilFoto,
  setIsDropdownOpen,
}: {
  user: User | null;
  profilFoto: string | null;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const MenuLink = ({
    href,
    children,
    icon,
  }: {
    href: string;
    children: React.ReactNode;
    icon: React.ReactNode;
  }) => (
    <Link
      href={href}
      className="text-primary-100 hover:bg-primary-700 flex w-full items-center justify-between px-6 py-3 text-left text-lg md:px-4 md:py-2 md:text-base"
      onClick={() => setIsDropdownOpen(false)}
    >
      {" "}
      {children} <span className="text-2xl md:text-xl">{icon}</span>{" "}
    </Link>
  );

  return (
    <div className="bg-primary-900/50 ring-opacity-5 fixed top-16 left-0 z-20 w-full rounded-b-lg shadow-lg ring-1 ring-black backdrop-blur-xl focus:outline-none md:absolute md:top-auto md:right-0 md:left-auto md:mt-2 md:w-56 md:origin-top-right md:translate-y-2/3 md:rounded-md md:py-2">
      {" "}
      {user ? (
        <>
          {" "}
          <div className="flex items-center gap-4 px-6 py-3 md:gap-3 md:px-4 md:py-2">
            {" "}
            <div className="relative h-12 w-12 overflow-hidden rounded-full md:h-10 md:w-10">
              {" "}
              <Image
                src={profilFoto || "/default-user.jpg"}
                alt="Profil fotoğrafı"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 48px, 40px"
              />{" "}
            </div>{" "}
            <span className="text-primary-50 truncate text-lg font-medium md:text-base">
              {" "}
              {user.email}{" "}
            </span>{" "}
          </div>
          <div className="bg-primary-700 my-1 h-px" />
          <MenuLink href="/profil" icon={<FaUser />}>
            <b>Profilim</b>
          </MenuLink>
          <MenuLink href="/abonelikler" icon={<MdPayments />}>
            Abonelikler
          </MenuLink>
          <div className="bg-primary-700 my-1 h-px" />
          <CikisYapButton
            icon={<ImExit className="text-2xl md:text-xl" />}
            className="text-primary-100 hover:bg-primary-700 flex w-full items-center justify-between px-6 py-3 text-lg md:px-4 md:py-2 md:text-base"
            href="/giris"
          >
            Çıkış Yap
          </CikisYapButton>
        </>
      ) : (
        <>
          <MenuLink href="/giris" icon={<VscSignIn />}>
            Giriş Yap
          </MenuLink>
          <Link
            className="text-primary-100 hover:bg-primary-700 flex w-full items-center justify-between px-6 py-3 text-lg md:px-4 md:py-2 md:text-base"
            href="/kayitol"
            onClick={() => setIsDropdownOpen(false)}
          >
            <span>Kayıt Ol</span>
            <svg
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 stroke-[1.5] md:w-5"
            >
              <path d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </Link>
          <div className="bg-primary-700 my-1 h-px" />
          <MenuLink href="/abonelikler" icon={<MdPayments />}>
            Abonelikler
          </MenuLink>
        </>
      )}
    </div>
  );
};

export default AsagiAcilirMenu;
