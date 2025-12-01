"use client";

import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im"; // Modern spinner
import {
  dahaSonraIzleIsaretliMi,
  dahaSonraIzleEkle,
} from "../../_lib/data-service-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // Kullanıcıya geri bildirim için

const DahaSonraIzleButton = ({ icerik_id }: { icerik_id: number }) => {
  const [isaretliMi, setIsaretliMi] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // İlk açılışta loading true olsun

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const result = await dahaSonraIzleIsaretliMi(icerik_id);
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
    e.preventDefault();
    if (isLoading) return;

    // Optimistic UI: Sunucuyu beklemeden arayüzü güncelle (Daha hızlı hissettirir)
    const yeniDurum = !isaretliMi;
    setIsaretliMi(yeniDurum);

    // Geri bildirim
    if (yeniDurum) toast.success("Listeye eklendi");
    else toast.success("Listeden çıkarıldı");

    // Arka planda işlemi yap
    try {
      await dahaSonraIzleEkle(icerik_id);
      // Garanti olsun diye sunucudan son durumu tekrar alabiliriz
      // setIsaretliMi(await dahaSonraIzleIsaretliMi(icerik_id));
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
      title={isaretliMi ? "Listemden Çıkar" : "Daha Sonra İzle"}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 active:scale-90 sm:h-12 sm:w-12 ${
        isaretliMi
          ? "border-secondary-1 bg-secondary-1 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]" // SEÇİLİ: Gold Dolgu
          : "border-white/20 bg-black/40 text-white backdrop-blur-md hover:border-white/40 hover:bg-white/10" // SEÇİLİ DEĞİL: Glass
      } `}
    >
      {isLoading ? (
        <ImSpinner8 className="animate-spin text-lg sm:text-xl" />
      ) : isaretliMi ? (
        <FaBookmark className="text-lg transition-transform duration-300 group-hover:scale-110 sm:text-xl" />
      ) : (
        <FaRegBookmark className="text-lg transition-transform duration-300 group-hover:scale-110 sm:text-xl" />
      )}
    </button>
  );
};

export default DahaSonraIzleButton;
