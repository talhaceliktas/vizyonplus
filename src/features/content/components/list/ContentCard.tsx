/**
 * Bu bileşen, içerikleri (Film/Dizi) liste görünümünde kart olarak gösterir.
 * Poster görseli, başlık, yıl, türler, puan ve "Daha Sonra İzle" butonunu içerir.
 * Hover efektleri ile oynatma butonu ve detayları gösterir.
 */

import Image from "next/image";
import Link from "next/link";
import { FaPlay, FaStar } from "react-icons/fa6";
import AddToWatchLaterButton from "@/shared/components/ui/AddToWatchLaterButton";
import { Table } from "../../../../types";

// Kart için gerekli veri tipi (Joined tablolar ile)
type IcerikData = Table<"icerikler"> & {
  isSaved: boolean; // Kullanıcının listesinde mi?
  icerik_puan_istatistikleri: Table<"icerik_puan_istatistikleri">; // Puan verileri
};

interface ContentCardProps {
  data: IcerikData;
}

const ContentCard = ({ data }: ContentCardProps) => {
  const {
    id,
    isim,
    fotograf,
    tur,
    turler,
    yayinlanma_tarihi,
    slug,
    isSaved,
    icerik_puan_istatistikleri,
  } = data;

  const yil = new Date(yayinlanma_tarihi).getFullYear();

  // Puan hesaplaması (null kontrolü ile)
  const toplamPuan = icerik_puan_istatistikleri?.toplam_puan || 0;
  const toplamKullanici = icerik_puan_istatistikleri?.toplam_kullanici || 0;
  const ortalamaPuan = toplamKullanici > 0 ? toplamPuan / toplamKullanici : 0;

  return (
    <div className="group relative flex flex-col gap-2">
      {/* --- GÖRSEL ALANI --- */}
      <div className="bg-primary-900 hover:border-secondary-1/50 hover:shadow-secondary-1/20 relative aspect-2/3 w-full overflow-hidden rounded-xl border border-white/5 shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        <Link
          href={`/izle${tur === "film" ? `/film/${slug}` : `/dizi/${slug}`} `}
          className="block h-full w-full"
        >
          <Image
            src={fotograf}
            alt={isim}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Koyulaştırma Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Oynat İkonu (Hover'da gelir) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
            <div className="bg-secondary-1 text-primary-950 flex h-12 w-12 items-center justify-center rounded-full shadow-xl backdrop-blur-sm">
              <FaPlay className="pl-1 text-lg" />
            </div>
          </div>
        </Link>

        {/* Daha Sonra İzle Butonu (Sağ Üst) */}
        <div className="absolute top-2 right-2 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <AddToWatchLaterButton contentId={id} initialState={isSaved} />
        </div>

        {/* Tür Etiketi (Sol Üst) */}
        <div className="absolute top-2 left-2 z-10">
          <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-md">
            {tur === "film" ? "FİLM" : "DİZİ"}
          </span>
        </div>
      </div>

      {/* --- BİLGİ ALANI --- */}
      <div className="px-1">
        <Link href={`/icerikler/${slug}`}>
          <h3 className="text-primary-50 group-hover:text-secondary-1 line-clamp-1 text-base font-bold transition-colors">
            {isim}
          </h3>
        </Link>

        {/* Alt Bilgiler: Yıl, İlk Tür, Puan */}
        <div className="text-primary-400 mt-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span>{yil}</span>
            {turler && turler.length > 0 && (
              <>
                <span className="bg-primary-600 h-1 w-1 rounded-full" />
                <span className="line-clamp-1 max-w-[100px]">{turler[0]}</span>
              </>
            )}
          </div>

          <div className="text-secondary-1 flex items-center gap-1">
            <FaStar size={10} />
            <span>{ortalamaPuan == 0 ? "—" : ortalamaPuan.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
