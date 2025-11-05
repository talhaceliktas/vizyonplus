"use client";

import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { IcerikTipi } from "../../types";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const IcerikSlider = ({
  icerikler,
  kategori,
}: {
  icerikler: IcerikTipi[];
  kategori: string;
}) => {
  return (
    <div className="w-full p-2 md:p-10">
      <div className="mb-4 flex justify-between">
        <h3 className="text-primary-50 text-lg duration-300 md:text-2xl">
          Vizyondaki Filmler
        </h3>
        <Link
          className="hover:text-secondary-1 text-primary-50 text-lg duration-300"
          href={`/icerikler/${icerikler[0].tur === "film" ? `filmler` : `diziler`}?tur=${kategori}`}
        >
          Tümünü Gör
        </Link>
      </div>

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
          640: {
            slidesPerView: 3,
          },
          1080: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 5,
          },
        }}
        className="[&_.swiper-pagination-bullet]:bg-primary-200/50 [&_.swiper-pagination-bullet-active]:bg-primary-200"
        style={{ paddingBottom: "2.5rem" }}
      >
        {icerikler.map((film) => (
          <SwiperSlide key={film.id}>
            <div className="relative aspect-[619/919] w-full overflow-hidden rounded-md">
              <Image
                src={film.fotograf}
                alt={`${film.isim} filmi`}
                fill
                className="object-cover"
                sizes="100%"
              />
              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <h3 className="text-sm font-semibold text-white sm:text-base md:text-lg">
                  {film.isim}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default IcerikSlider;
