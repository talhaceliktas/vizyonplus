"use client";

import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper stilleri
import "swiper/css";
import "swiper/css/pagination";

import { Content } from "@features/content/types";

// BU DOSYA NE İŞE YARAR?
// `ContentRow` tarafından kullanılan, içerikleri yatayda kaydırmalı (carousel) olarak gösteren bileşendir.
// "use client" zorunludur.

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
        // Otomatik kaydırma ayarları
        autoplay={{
          delay: 2500,
          disableOnInteraction: true, // Kullanıcı müdahale ederse otomatik kayma dursun
          pauseOnMouseEnter: true, // Mouse üzerine gelince duraklasın
        }}
        spaceBetween={16} // Slide'lar arası boşluk (piksel)
        slidesPerView={2} // Mobil: 2 tane göster
        // Responsive Ayarlar (Ekran genişliğine göre kaç tane görünecek)
        breakpoints={{
          640: { slidesPerView: 3 }, // Tablet
          1080: { slidesPerView: 4 }, // Laptop
          1280: { slidesPerView: 5 }, // Desktop
        }}
        // CSS Sınıfları (Tailwind Arbitrary Values)
        // Swiper'ın kendi pagination noktalarını özelleştirmek için [&_...] syntax'ı kullanıldı.
        className="[&_.swiper-pagination-bullet]:bg-primary-200/50 [&_.swiper-pagination-bullet-active]:bg-primary-200 pb-10!"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            {/* Kart Tasarımı */}
            {/* group: Hover efektlerini tetiklemek için kapsayıcıya verilir. */}
            <div className="group relative aspect-619/919 w-full overflow-hidden rounded-md">
              <Link href={`/icerikler/${item.slug}`}>
                <Image
                  src={item.fotograf}
                  alt={`${item.isim} posteri`}
                  fill
                  // grayscale-25: Hafif siyah beyaz başla
                  // group-hover:scale-110: Üzerine gelince resmi büyüt
                  className="object-cover grayscale-25 duration-300 group-hover:scale-110 group-hover:grayscale-0"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                />
              </Link>

              {/* İsim Alanı (Overlay) */}
              {/* Resmin altında değil, üzerinde (absolute) durur. */}
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
