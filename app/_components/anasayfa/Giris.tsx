"use client";

import Image from "next/image";
import { MdOutlineDateRange } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useTheme } from "next-themes";

import marvelBannerDark from "../../../public/marvelBannerDark.jpg";
import marvelBannerLight from "../../../public/marvelBannerLight.jpg";
import marvelLogo from "../../../public/marvelLogo.png";
import Link from "next/link";

const Giris = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const bannerImage =
    currentTheme === "dark" ? marvelBannerDark : marvelBannerLight;

  return (
    <div className="relative">
      <div className="relative h-screen">
        <Image
          src={bannerImage}
          fill
          alt="Marvel Banneri"
          className="object-cover brightness-90 duration-1000 dark:opacity-60"
          sizes="100vw"
          priority
        />

        <div className="dark:bg-primary-900/5 bg-primary-900/40 absolute top-1/2 ml-5 -translate-y-1/2 rounded-2xl border border-white/10 p-4 shadow-xl backdrop-blur-[0.3rem] duration-500 hover:scale-105 md:ml-40 md:p-6 dark:shadow-black/50">
          <div className="relative h-[7rem] w-[14rem] md:h-[15rem] md:w-[30rem]">
            <Image
              src={marvelLogo}
              fill
              alt="Marvel Logosu"
              className="object-contain"
              sizes="(max-width: 768px) 14rem, 30rem"
            />
          </div>
          <div className="flex flex-col items-center gap-x-5 gap-y-2 text-sm md:flex-row md:gap-y-0 md:text-base">
            <h3 className="text-primary-100 duration-100">
              Aksiyon | Macera | Bilim Kurgu
            </h3>
            <div className="text-primary-300 flex gap-x-5 duration-100">
              <p className="flex items-center gap-x-2 font-bold">
                <MdOutlineDateRange />
                2018
              </p>
              <p className="flex items-center gap-x-2 font-bold">
                <FaRegClock />
                2s 23dk
              </p>
            </div>
          </div>

          <hr className="border-primary-50 my-3 duration-100" />

          <p className="text-primary-50 w-[14rem] px-1 duration-100 md:w-[30rem]">
            Marvel Sinematik Evreni’nin en büyük buluşması! Avengers: Endgame,
            Thanos’un evrenin yarısını yok etmesinin ardından kalan
            kahramanların son bir umutla mücadelesini konu alıyor. Zaman,
            fedakârlık ve dostluk üzerine kurulu bu destansı final; duygusal
            anları, etkileyici görsel efektleri ve unutulmaz sahneleriyle
            izleyicileri büyülüyor.
          </p>

          <Link
            className="mt-4 flex items-center justify-end gap-x-2 pr-2 duration-300 hover:scale-x-[1.05] hover:scale-y-[1.15] hover:gap-x-4"
            href=""
          >
            <p className="dark:from-secondary-1 dark:via-secondary-2 dark:to-secondary-1 from-secondary-3 via-secondary-2 to-secondary-3 bg-gradient-to-l bg-clip-text font-bold text-transparent duration-100">
              Filme Git
            </p>
            <HiArrowNarrowRight className="fill-secondary-2 text-2xl" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Giris;
