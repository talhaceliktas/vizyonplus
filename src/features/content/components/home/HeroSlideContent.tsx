/**
 * Bu bileşen, Ana Sayfa slider'ındaki metin ve butonları içerir.
 * Başlık, kategori, süre, açıklama ve "Filme Git" butonunu gösterir.
 */

"use client";

import Link from "next/link";
import { MdOutlineDateRange } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { HiArrowNarrowRight } from "react-icons/hi";

import { FeaturedContent } from "@features/content/types";

interface HeroSlideContentProps {
  item: FeaturedContent;
}

const HeroSlideContent = ({ item }: HeroSlideContentProps) => {
  return (
    <div className="bg-primary-900/5 absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-2xl border border-white/10 p-4 shadow-xl backdrop-blur-[0.3rem] duration-500 hover:scale-105 md:left-24 md:p-6 lg:left-40 dark:shadow-black/50">
      <div className="flex flex-col items-start gap-x-5 gap-y-2 text-sm md:flex-row md:items-center md:gap-y-0 md:text-base">
        <h3 className="text-3xl text-white duration-100">{item.isim}</h3>

        <div className="flex gap-x-5 text-white/50 duration-100">
          <p className="flex items-center gap-x-2 font-bold">
            <MdOutlineDateRange />
            {item.kategoriler}
          </p>
          <p className="flex items-center gap-x-2 font-bold">
            <FaRegClock />
            {item.sure}
          </p>
        </div>
      </div>

      <hr className="my-3 border-white duration-100" />

      <p className="max-w-xs px-1 text-white/80 duration-100 md:max-w-md lg:max-w-lg">
        {item.aciklama}
      </p>

      <Link
        className="mt-4 flex items-center justify-end gap-x-2 pr-2 duration-300 hover:scale-x-[1.05] hover:scale-y-[1.15] hover:gap-x-4"
        href={`icerikler/${item.slug}`}
      >
        <p className="dark:from-secondary-1 dark:via-secondary-2 dark:to-secondary-1 from-secondary-3 via-secondary-2 to-secondary-3 bg-linear-to-l bg-clip-text font-bold text-transparent duration-100">
          {item.tur === "film" ? "Filme Git" : "Diziye Git"}
        </p>
        <HiArrowNarrowRight className="fill-secondary-2 text-2xl" />
      </Link>
    </div>
  );
};

export default HeroSlideContent;
