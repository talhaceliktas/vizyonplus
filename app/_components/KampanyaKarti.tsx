"use client"; // Mouse takibi için client component olmalı

import React, { useState } from "react";
import Link from "next/link"; // Link component'ini import ediyoruz
import { poppins } from "../_lib/fontlar";

type KampanyaKartiProps = {
  baslik: string;
  aciklama: string;
  ikon?: React.ReactNode; // Kampanyaya özel bir ikon eklemek için
  link: string; // Tıklanınca gidilecek URL
};

const KampanyaKarti: React.FC<KampanyaKartiProps> = ({
  baslik,
  aciklama,
  ikon,
  link,
}) => {
  // Mouse pozisyonunu ve hover durumunu saklamak için state'ler
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse hareket ettiğinde pozisyonu güncelleyen fonksiyon
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    // En dıştaki div'i Next.js Link component'i ile değiştirdik
    <Link
      href={link}
      onMouseMove={handleMouseMove} // Mouse hareketini izle
      onMouseEnter={() => setIsHovered(true)} // Mouse karta girdi
      onMouseLeave={() => setIsHovered(false)} // Mouse karttan çıktı
      className={`border-primary-700 from-primary-800 to-primary-900 hover:border-secondary-1/80 hover:shadow-secondary-1/25 relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br p-8 text-center shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.1 : 0, // Sadece hover durumunda göster
          background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, var(--color-secondary-1-2), transparent 80%)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        {ikon && (
          <div className="text-secondary-1 mb-6 rounded-full bg-white/10 p-4 shadow-inner backdrop-blur-sm">
            {ikon}
          </div>
        )}
        <h3
          className={`mb-4 text-3xl font-bold text-white ${poppins.className}`}
        >
          {baslik}
        </h3>
        <p className="text-md text-primary-200 flex-grow">{aciklama}</p>

        {/* BUTONU SİLDİK - Artık tüm kart tıklanabilir */}

        {/* Kullanıcıyı yönlendirmek için küçük bir ipucu ekleyebiliriz */}
        <div className="text-secondary-1/80 mt-8 text-sm font-semibold">
          Detayları Gör
        </div>
      </div>
    </Link>
  );
};

export default KampanyaKarti;
