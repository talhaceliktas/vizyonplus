"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Play, Lock } from "lucide-react";
import toast from "react-hot-toast";

type IzleButonuProps = {
  icerikId: number;
  aboneMi: boolean;
  sahipMi: boolean;
  tur: string;
};

export default function IzleButonu({
  icerikId,
  aboneMi,
  sahipMi,
  tur,
}: IzleButonuProps) {
  const router = useRouter();

  const handleIzle = () => {
    if (aboneMi || sahipMi) {
      router.push(
        tur === "film" ? `/izle/film/${icerikId}` : `/izle/dizi/${icerikId}`,
      );
      toast.success("İyi seyirler! Player açılıyor...");
      console.log("Player'a yönlendiriliyor ID:", icerikId);
    } else {
      toast.error("Bu içeriği izlemek için aktif bir abonelik gerekiyor.");
      router.push("/abonelikler");
    }
  };

  return (
    <button
      onClick={handleIzle}
      className={`group flex w-full items-center justify-center gap-3 rounded-xl px-8 py-4 text-lg font-bold shadow-lg transition-all active:scale-95 ${
        aboneMi || sahipMi
          ? "bg-secondary-2 shadow-secondary-2/20 hover:bg-secondary-1-2 text-black" // Gold Tema (İzle)
          : "bg-primary-800 hover:bg-primary-900 text-red-500" // Kilitli Tema (Abone Ol)
      }`}
    >
      {aboneMi || sahipMi ? (
        <>
          <Play className="h-6 w-6 fill-current" />
          <span>Hemen İzle</span>
        </>
      ) : (
        <>
          <Lock className="h-6 w-6" />
          <span>İzlemek İçin Abone Ol</span>
        </>
      )}
    </button>
  );
}
