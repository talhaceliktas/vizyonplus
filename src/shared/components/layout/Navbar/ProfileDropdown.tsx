"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

import { ImExit } from "react-icons/im";
import { FaUser, FaUserPlus } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import { VscSignIn } from "react-icons/vsc";
import { RiAdminFill } from "react-icons/ri";

import LogoutButton from "@/features/auth/components/LogoutButton";

interface ProfileDropdownProps {
  user: User | null;
  avatarUrl: string | null;
  onClose: () => void;
}

// Helper Bileşen (Dışarı alındı)
const MenuLink = ({
  href,
  children,
  icon,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <Link
    href={href}
    className="text-primary-100 hover:bg-primary-700 flex w-full items-center justify-between px-6 py-3 text-left text-lg transition-colors md:px-4 md:py-2 md:text-base"
    onClick={onClick}
  >
    {children} <span className="text-2xl md:text-xl">{icon}</span>
  </Link>
);

const ProfileDropdown = ({
  user,
  avatarUrl,
  onClose,
}: ProfileDropdownProps) => {
  return (
    <div className="bg-primary-900/50 md:bg-primary-900 fixed top-16 left-0 z-20 w-full rounded-b-lg shadow-lg ring-1 ring-black backdrop-blur-xl focus:outline-none md:absolute md:top-auto md:right-0 md:left-auto md:mt-2 md:w-56 md:origin-top-right md:translate-y-2/3 md:rounded-md md:py-2">
      {user ? (
        <>
          <div className="flex items-center gap-4 px-6 py-3 md:gap-3 md:px-4 md:py-2">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full md:h-10 md:w-10">
              <Image
                src={avatarUrl || "/default-user.jpg"}
                alt="Profil fotoğrafı"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 48px, 40px"
              />
            </div>
            <span className="text-primary-50 truncate text-lg font-medium md:text-base">
              {user.email}
            </span>
          </div>

          <div className="bg-primary-700 my-1 h-px" />

          <MenuLink href="/profil" icon={<FaUser />} onClick={onClose}>
            <b>Profilim</b>
          </MenuLink>

          <MenuLink href="/abonelikler" icon={<MdPayments />} onClick={onClose}>
            Abonelikler
          </MenuLink>

          {user.app_metadata?.role === "admin" && (
            <MenuLink href="/admin" icon={<RiAdminFill />} onClick={onClose}>
              Admin Paneli
            </MenuLink>
          )}

          <div className="bg-primary-700 my-1 h-px" />

          <LogoutButton
            className="text-primary-100 hover:bg-primary-700 flex w-full items-center justify-between px-6 py-3 text-lg transition-colors md:px-4 md:py-2 md:text-base"
            icon={<ImExit className="text-2xl md:text-xl" />}
            href="/giris"
          >
            Çıkış Yap
          </LogoutButton>
        </>
      ) : (
        <>
          <MenuLink href="/giris" icon={<VscSignIn />} onClick={onClose}>
            Giriş Yap
          </MenuLink>

          <MenuLink href="/kayitol" icon={<FaUserPlus />} onClick={onClose}>
            Kayıt Ol
          </MenuLink>

          <div className="bg-primary-700 my-1 h-px" />

          <MenuLink href="/abonelikler" icon={<MdPayments />} onClick={onClose}>
            Abonelikler
          </MenuLink>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
