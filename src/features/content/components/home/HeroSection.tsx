"use client";

import { useState } from "react";
import Image from "next/image";

// Swiperjs Kütüphanesi
// Slider (kaydırıcı) yapısı için kullanılır.
import { type Swiper as SwiperCore } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Thumbs } from "swiper/modules";

// Swiper CSS'leri (Zorunlu)
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import HeroSlideContent from "./HeroSlideContent";
import HeroThumbs from "./HeroThumbs";

import { FeaturedContent } from "@features/content/types";

// BU DOSYA NE İŞE YARAR?
// Ana sayfadaki büyük slider alanıdır.
// Sadece istemci tarafında çalışır (use client) çünkü interaktif bir slider kütüphanesi (Swiper) kullanır.

interface HeroSectionProps {
  data: FeaturedContent[];
}

const HeroSection = ({ data }: HeroSectionProps) => {
  // Alttaki küçük resimlerin (Thumbnails) Swiper instance'ını tutar.
  // Ana slide ile küçük resimleri senkronize etmek için gereklidir.
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  // Veri yoksa render etme (Boş ekranı önle)
  if (!data || data.length === 0) return null;

  return (
    <div className="relative h-screen w-full">
      <Swiper
        // Kullanılacak modüller (Pagination: Alttaki noktalar, EffectFade: Silik geçiş)
        modules={[Pagination, Autoplay, EffectFade, Thumbs]}
        // Küçük resimlerle bağlantı kur
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className="main-swiper h-full w-full"
        effect="fade" // Slide kaymak yerine silinerek değişsin
        loop={true} // Sona gelince başa dön
        autoplay={{
          delay: 5000, // 5 saniyede bir otomatik geç
          disableOnInteraction: false, // Kullanıcı dokunsa bile otomatik oynatmaya devam et
        }}
        pagination={{
          clickable: true, // Noktalara tıklanabilsin
        }}
      >
        {data.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative h-screen w-full">
            {/* Karartma Katmanı: Resmin üzerini hafif karart ki yazılar okunsun */}
            <div className="absolute inset-0 z-10 bg-black/40" />

            {/* Next.js Image Component */}
            {/* fill: Kapsayıcıyı (h-screen) tam doldur */}
            {/* priority: İlk resmi hemen yükle (LCP performansı için önemli) */}
            <Image
              src={slide.poster}
              fill
              alt={slide.isim}
              className="object-cover duration-1000" // object-cover: Resmi bozmadan alanı doldur
              sizes="100vw"
              priority={index === 0}
            />

            {/* Slide İçerik Yazıları */}
            <HeroSlideContent item={slide} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Sağ alttaki küçük önizleme resimleri */}
      <HeroThumbs data={data} onSwiper={setThumbsSwiper} />
    </div>
  );
};

export default HeroSection;
