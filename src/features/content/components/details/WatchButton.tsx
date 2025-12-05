"use client";

import { useRouter } from "next/navigation";
import { Play, Lock } from "lucide-react";
import toast from "react-hot-toast";

type WatchButtonProps = {
  icerikId: number;
  aboneMi: boolean;
  tur: string;
  sonIzlenen: any;
};

export default function WatchButton({
  icerikId,
  aboneMi,
  tur,
  sonIzlenen,
}: WatchButtonProps) {
  const router = useRouter();

  // Verileri güvenli şekilde al
  const bolumBilgisi = sonIzlenen?.bolumler;
  const kalinanSaniye = sonIzlenen?.kalinan_saniye || 0;
  const toplamSaniye = sonIzlenen?.toplam_saniye || 1;

  // Dakika hesabı (Aşağı yuvarla)
  const kalinanDakika = Math.floor(kalinanSaniye / 60);

  // Mantıksal Kontroller
  const diziDevamEdiyor = tur === "dizi" && bolumBilgisi;
  // Film için en az 10 saniye izlenmişse "devam et" modu açılsın
  const filmDevamEdiyor = tur === "film" && sonIzlenen && kalinanSaniye > 10;

  const devamModu = diziDevamEdiyor || filmDevamEdiyor;
  const izlenmeYuzdesi = devamModu ? (kalinanSaniye / toplamSaniye) * 100 : 0;

  const handleIzle = () => {
    if (!aboneMi) {
      toast.error("İzlemek için abone olmalısınız.");
      router.push("/abonelikler");
      return;
    }

    let hedefUrl = "";

    if (tur === "dizi") {
      if (diziDevamEdiyor) {
        hedefUrl = `/izle/dizi/${icerikId}/${bolumBilgisi.sezon_numarasi}/${bolumBilgisi.bolum_numarasi}`;
        toast.success(
          `S${bolumBilgisi.sezon_numarasi}.B${bolumBilgisi.bolum_numarasi} açılıyor...`,
        );
      } else {
        hedefUrl = `/izle/dizi/${icerikId}`;
      }
    } else {
      // Film
      hedefUrl = `/izle/film/${icerikId}`;
      if (filmDevamEdiyor) toast.success("Kaldığınız yerden devam ediliyor...");
    }

    router.push(hedefUrl);
  };

  return (
    <button
      onClick={handleIzle}
      className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl px-8 py-4 text-lg font-bold shadow-lg transition-all active:scale-95 ${
        aboneMi
          ? "bg-yellow-500 text-black shadow-yellow-500/20 hover:bg-yellow-400"
          : "bg-white/10 text-gray-400 hover:bg-white/20"
      }`}
    >
      {aboneMi ? (
        <>
          <Play className="relative z-10 h-6 w-6 fill-current" />

          <div className="relative z-10 flex flex-col items-start gap-1 leading-none">
            {/* Üst Bilgi Yazısı */}
            {devamModu && (
              <span className="text-[10px] font-bold tracking-wide uppercase opacity-70">
                Kaldığın Yerden
              </span>
            )}

            {/* Ana Buton Metni */}
            <span className="flex items-center gap-1.5">
              {devamModu ? (
                <>
                  {diziDevamEdiyor ? (
                    // DİZİ İÇİN: S1.B9 • 4. dk
                    <span>
                      S{bolumBilgisi.sezon_numarasi}.B
                      {bolumBilgisi.bolum_numarasi}
                      <span className="mx-1 opacity-50">•</span>
                      {kalinanDakika}. dk
                    </span>
                  ) : (
                    // FİLM İÇİN: Devam Et • 6. dk
                    <span>
                      Devam Et
                      <span className="mx-1 opacity-50">•</span>
                      {kalinanDakika}. dk
                    </span>
                  )}
                </>
              ) : (
                // HİÇ İZLENMEMİŞSE
                <span>Hemen İzle</span>
              )}
            </span>
          </div>

          {/* Progress Bar (Kırmızı Çizgi) */}
          {devamModu && (
            <div className="absolute bottom-0 left-0 h-1 w-full bg-black/10">
              <div
                className="h-full bg-red-600 transition-all duration-300"
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
