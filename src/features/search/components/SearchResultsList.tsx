// app/_components/navbar/SearchResultsList.tsx (veya senin klasör yapına göre)
"use client";

/**
 * Bu bileşen, arama sonuçlarını listeleyen açılır penceredir.
 * Masaüstü ve mobil görünümler için farklı stiller uygular.
 */

import Link from "next/link";
import Image from "next/image";

// Arama sonucu veri tipi
export interface SearchResult {
  id: string | number;
  fotograf: string;
  isim?: string;
  aciklama?: string;
  tur?: string;
  slug: string;
}

interface SearchResultsListProps {
  results: SearchResult[]; // Gösterilecek sonuçlar
  onClose: () => void; // Listeden bir öğeye tıklandığında çalışacak fonksiyon
  isMobileView: boolean; // Mobil görünüm aktif mi?
}

const SearchResultsList = ({
  results,
  onClose,
  isMobileView,
}: SearchResultsListProps) => {
  // Sonuç yoksa render etme
  if (results.length === 0) return null;

  return (
    <div
      className={`absolute z-50 mt-2 grid grid-cols-1 gap-1 overflow-scroll overflow-x-hidden rounded-xl border border-gray-200 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90 ${
        isMobileView
          ? "right-0 left-0 max-h-[60vh] overflow-y-auto" // Mobil: Geniş ve kaydırılabilir
          : "custom-scrollbar right-0 max-h-112 w-[24rem] overflow-y-auto" // Masaüstü: Sabit genişlik, sağa dayalı
      } `}
    >
      {results.map((item) => (
        <Link
          key={item.id}
          onClick={onClose} // Tıklayınca pencereyi kapat
          href={`/icerikler/${item.slug}`} // İçerik detay sayfasına git
          className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
        >
          {/* Görsel */}
          <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded shadow-sm">
            <Image
              alt={item.isim || "Görsel"}
              src={item.fotograf || "/placeholder.jpg"}
              fill
              sizes="40px"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Yazılar ve Bilgiler */}
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="flex items-center justify-between">
              {/* Başlık Rengi: Light'ta Siyah, Dark'ta Beyaz */}
              <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                {item.isim}
              </h4>

              {/* Tür Etiketi (Film/Dizi) */}
              <span className="ml-2 shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-gray-600 uppercase dark:bg-white/10 dark:text-gray-300">
                {item.tur}
              </span>
            </div>

            {/* Açıklama Rengi: Light'ta Gri, Dark'ta Açık Gri */}
            <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
              {item.aciklama || "Açıklama bulunamadı."}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResultsList;
