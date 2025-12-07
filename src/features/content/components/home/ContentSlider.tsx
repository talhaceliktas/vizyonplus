"use client";

import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { Content } from "@features/content/types";

interface ContentSliderProps {
  items: Content[];
}

const ContentSlider = ({ items }: ContentSliderProps) => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        loop={true}
        speed={500}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          1080: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        // Pagination renk ayarları
        className="[&_.swiper-pagination-bullet]:bg-primary-200/50 [&_.swiper-pagination-bullet-active]:bg-primary-200 pb-10!"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="group relative aspect-619/919 w-full overflow-hidden rounded-md">
              <Link href={`/icerikler/${item.slug}`}>
                <Image
                  src={item.fotograf}
                  alt={`${item.isim} posteri`}
                  fill
                  className="object-cover grayscale-25 duration-300 group-hover:scale-110 group-hover:grayscale-0"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                />
              </Link>

              {/* İsim Alanı (Overlay) */}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/60 to-transparent p-3 pt-8 opacity-100 duration-300">
                <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                  {item.isim}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContentSlider;
