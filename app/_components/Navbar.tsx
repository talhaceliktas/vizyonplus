"use client";

import Link from "next/link";
import { FaCircleUser } from "react-icons/fa6";
import { useEffect, useState } from "react";
import biletcimLogo from "../../public/logo.png";
import Image from "next/image";

const Navbar = () => {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTop]);

  return (
    <div
      className={`fixed top-0 z-10 w-full duration-300 ${isTop ? "" : "bg-primary-950/35 backdrop-blur-xl"}`}
    >
      <div
        className={`flex items-center justify-between px-4 duration-300 md:justify-around ${isTop ? "py-6" : "py-4"}`}
      >
        <Link href="/">
          <Image
            alt="Biletcim Logosu"
            src={biletcimLogo}
            className="w-32 sm:w-44"
          />
        </Link>
        <div className="hidden items-center gap-x-5 font-semibold md:flex">
          <Link
            href="/icerikler"
            className="hover:text-primary-200 duration-300"
          >
            Dijital İçerikler
          </Link>
          <Link
            href="/kampanyalar"
            className="hover:text-primary-200 duration-300"
          >
            Kampanyalar
          </Link>
          <input
            type="text"
            className="bg-primary-50 placeholder:text-primary-500 text-primary-900 w-[15rem] rounded-full p-1 pl-3 duration-300 focus:w-[20rem]"
            placeholder="Ara..."
          />
        </div>
        <Link href="/giris" className="cursor-pointer">
          <FaCircleUser className="text-3xl" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
