"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Play, Lock } from "lucide-react";
import toast from "react-hot-toast";

type IzleButonuProps = {
  icerikId: number;
  aboneMi: boolean;
  sahipMi: boolean;
  tur: "dizi" | "film" | string;
  sonIzlenen;
};

export default function IzleButonu({
  icerikId,
  aboneMi,
  sahipMi,
  tur,
  sonIzlenen,
}: IzleButonuProps) {
  const router = useRouter();

  // --- MANTIKSAL KONTROLLER ---

  const bolumBilgisi = sonIzlenen?.bolumler;
  const kalinanSaniye = sonIzlenen?.kalinan_saniye || 0;
  const toplamSaniye = sonIzlenen?.toplam_saniye || 1; // 0 hatasını önlemek için 1

  // Dizi için devam etme şartı: Tür dizi olmalı VE bölüm verisi gelmeli
  const diziDevamEdiyor = tur === "dizi" && bolumBilgisi;

  // Film için devam etme şartı: Tür film olmalı VE veri gelmeli VE en azından başlanmış olmalı
  const filmDevamEdiyor = tur === "film" && sonIzlenen && kalinanSaniye > 5; // 5 saniyeden azsa baştan başlatır

  // Genel Devam Modu (UI buna göre şekillenecek)
  const devamModu = diziDevamEdiyor || filmDevamEdiyor;

  // --- YÜZDE HESAPLAMA ---
  const izlenmeYuzdesi = devamModu ? (kalinanSaniye / toplamSaniye) * 100 : 0;

  const handleIzle = () => {
    // 1. Erişim Kontrolü
    if (!aboneMi && !sahipMi) {
      toast.error("Bu içeriği izlemek için aktif bir abonelik gerekiyor.");
      router.push("/abonelikler");
      return;
    }

    let hedefUrl = "";
    const saniyeYuvarla = Math.floor(kalinanSaniye);

    // --- DİZİ YÖNLENDİRMESİ ---
    if (tur === "dizi") {
      if (diziDevamEdiyor) {
        // Kaldığı bölümden ve saniyeden devam
        // URL yapın: /izle/dizi/ID?bolumId=ID&t=SANIYE
        hedefUrl = `/izle/dizi/${icerikId}/${bolumBilgisi.sezon_numarasi}/${bolumBilgisi.bolum_numarasi}`;

        toast.success(
          `S${bolumBilgisi.sezon_numarasi}.B${bolumBilgisi.bolum_numarasi} yükleniyor...`,
        );
      } else {
        hedefUrl = `/izle/dizi/${icerikId}`;
        toast.success("Keyifli seyirler!");
      }
    }

    // --- FİLM YÖNLENDİRMESİ ---
    else if (tur === "film") {
      if (filmDevamEdiyor) {
        // Kaldığı saniyeden devam
        hedefUrl = `/izle/film/${icerikId}`;
        toast.success("Kaldığınız yerden devam ediliyor...");
      } else {
        // Baştan başla
        hedefUrl = `/izle/film/${icerikId}`;
        toast.success("Keyifli seyirler! Film başlıyor...");
      }
    }

    router.push(hedefUrl);
  };

  return (
    <button
      onClick={handleIzle}
      className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl px-8 py-4 text-lg font-bold shadow-lg transition-all active:scale-95 ${
        aboneMi || sahipMi
          ? "bg-secondary-2 dark:bg-secondary-1-2 shadow-secondary-2/20 hover:bg-secondary-1-2 dark:hover:bg-secondary-2 text-black" // Gold Tema
          : "bg-primary-800 hover:bg-primary-900 text-red-500" // Kilitli Tema
      }`}
    >
      {aboneMi || sahipMi ? (
        <>
          <Play className="relative z-10 h-6 w-6 fill-current" />

          {/* --- METİN ALANI --- */}
          {devamModu ? (
            <div className="relative z-10 flex flex-col items-start leading-none">
              <span className="mb-0.5 text-xs font-medium opacity-70">
                Kaldığın Yerden
              </span>

              {/* Dizi ise Sezon/Bölüm, Film ise Genel Mesaj */}
              {diziDevamEdiyor ? (
                <span>
                  S{bolumBilgisi.sezon_numarasi}. B{bolumBilgisi.bolum_numarasi}{" "}
                  • Devam Et
                </span>
              ) : (
                <span>Filmi Sürdür • Devam Et</span>
              )}
            </div>
          ) : (
            <span className="relative z-10">Hemen İzle</span>
          )}

          {/* --- PROGRESS BAR --- */}
          {devamModu && (
            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-black/10">
              <div
                className="h-full bg-red-600 transition-all duration-300 ease-out"
                style={{ width: `${izlenmeYuzdesi}%` }}
              />
            </div>
          )}
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
