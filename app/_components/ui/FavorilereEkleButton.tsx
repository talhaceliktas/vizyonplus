"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im"; // Modern spinner
import {
  favoriIsaretliMi,
  favorilereEkle,
} from "../../_lib/data-service-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FavorilereEkleButton = ({ icerik_id }: { icerik_id: number }) => {
  const [isaretliMi, setIsaretliMi] = useState(false);
  // Sayfa ilk yüklendiğinde durum kontrolü yapılırken loading gösterelim
  const [isLoading, setIsLoading] = useState(true);

  // Başlangıç durumunu çek
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const result = await favoriIsaretliMi(icerik_id);
        if (isMounted) setIsaretliMi(result);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [icerik_id]);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); // Link içinde kullanıldığı için sayfa geçişini engelle
    if (isLoading) return;

    // --- OPTIMISTIC UI ---
    // Sunucuyu beklemeden arayüzü güncelle (Daha hızlı hissettirir)
    const yeniDurum = !isaretliMi;
    setIsaretliMi(yeniDurum);

    // Geri bildirim
    if (yeniDurum) toast.success("Favorilere eklendi ❤️");
    else toast.success("Favorilerden çıkarıldı");

    // Arka planda sunucu işlemini yap
    try {
      await favorilereEkle(icerik_id);
      // Garanti olsun diye sunucudan teyit alabiliriz (Opsiyonel)
      // setIsaretliMi(await favoriIsaretliMi(icerik_id));
    } catch (error) {
      // Hata olursa eski haline döndür
      setIsaretliMi(!yeniDurum);
      toast.error("İşlem başarısız");
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      title={isaretliMi ? "Favorilerden Çıkar" : "Favorilere Ekle"}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 active:scale-90 sm:h-12 sm:w-12 ${
        isaretliMi
          ? "border-red-500 bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" // SEÇİLİ: Kırmızı Parlayan Dolgu
          : "border-white/20 bg-black/40 text-white backdrop-blur-md hover:border-white/40 hover:bg-white/10" // SEÇİLİ DEĞİL: Glass Effect
      } `}
    >
      {isLoading ? (
        <ImSpinner8 className="animate-spin text-lg sm:text-xl" />
      ) : isaretliMi ? (
        <FaHeart className="text-lg transition-transform duration-300 group-hover:scale-110 sm:text-xl" />
      ) : (
        <FaRegHeart className="text-lg transition-transform duration-300 group-hover:scale-110 sm:text-xl" />
      )}
    </button>
  );
};

export default FavorilereEkleButton;
