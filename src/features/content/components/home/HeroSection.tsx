"use client";

import { useState } from "react";
import Image from "next/image";

import { type Swiper as SwiperCore } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import HeroSlideContent from "./HeroSlideContent";
import HeroThumbs from "./HeroThumbs";

import { FeaturedContent } from "@features/content/types";

interface HeroSectionProps {
  data: FeaturedContent[];
}

const HeroSection = ({ data }: HeroSectionProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  if (!data || data.length === 0) return null;

  return (
    <div className="relative h-screen w-full">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade, Thumbs]}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className="main-swiper h-full w-full"
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
      >
        {data.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative h-screen w-full">
            {/* Karartma Katmanı */}
            <div className="absolute inset-0 z-10 bg-black/40" />

            <Image
              src={slide.poster}
              fill
              alt={slide.isim}
              className="object-cover duration-1000"
              sizes="100vw"
              priority={index === 0}
            />

            <HeroSlideContent item={slide} />
          </SwiperSlide>
        ))}
      </Swiper>

      <HeroThumbs data={data} onSwiper={setThumbsSwiper} />
    </div>
  );
};

export default HeroSection;
