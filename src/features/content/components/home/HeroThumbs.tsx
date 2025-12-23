/**
 * Bu bileşen, Ana Sayfa slider'ının sağ alt köşesindeki KÜÇÜK ÖNİZLEME (Thumbnail) listesidir.
 * Swiper'ın `thumbs` modülü ile ana slider'ı kontrol eder.
 * Kullanıcı buradan bir resme tıklayınca ana slider o içeriğe geçer.
 */

"use client";

import Image from "next/image";
import { type Swiper as SwiperCore } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { FeaturedContent } from "@features/content/types";

interface HeroThumbsProps {
  data: FeaturedContent[];
  onSwiper: (swiper: SwiperCore) => void;
}

const HeroThumbs = ({ data, onSwiper }: HeroThumbsProps) => {
  return (
    <div className="absolute right-6 bottom-6 z-20 hidden w-full max-w-sm md:block lg:max-w-md xl:right-40 xl:max-w-lg">
      <Swiper
        onSwiper={onSwiper}
        modules={[Thumbs, Navigation]}
        watchSlidesProgress={true}
        className="thumb-swiper"
        slidesPerView={4}
        spaceBetween={10}
        navigation={true}
        loop={false}
        slideToClickedSlide={true}
      >
        {data.map((item) => (
          <SwiperSlide
            key={item.id}
            className="relative aspect-16/10 cursor-pointer"
          >
            <Image
              src={item.poster}
              fill
              alt={`${item.isim} posteri`}
              className="rounded-md object-cover"
              sizes="150px"
            />
            <div className="absolute bottom-0 left-0 w-full truncate bg-black/70 p-1 text-center text-xs font-semibold text-white">
              {item.isim}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroThumbs;
