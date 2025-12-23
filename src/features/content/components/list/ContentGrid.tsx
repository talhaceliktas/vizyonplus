/**
 * Bu bileşen, filtrelenmiş içerikleri ızgara (grid) yapısında gösteren Sunucu Bileşenidir (Server Component).
 * Filtreleme parametrelerini alır, veriyi çeker ve sonuçları listeler.
 * Sonuç yoksa boş durum (empty state) gösterir.
 */

import ContentCard from "@/features/content/components/list/ContentCard";
import Pagination from "@/features/content/components/list/Pagination";
import { getFilteredContents } from "@/features/content/services/contentService";
import { FaFilm } from "react-icons/fa6";

interface Props {
  tur: string | null;
  kategori: string[] | null; // Birden fazla kategori seçilebilir
  sirala: string | null; // Sıralama kriteri (yeniden eskiye, puana göre vb.)
  page: number; // Sayfa numarası
}

export default async function ContentGrid({
  tur,
  kategori,
  sirala,
  page,
}: Props) {
  // Veriyi sunucu tarafında çek
  const { data: icerikler, count } = await getFilteredContents(
    tur,
    kategori,
    sirala,
    page,
  );

  // Debug için toplam sayı
  console.log(count);

  // Boş Durum (Empty State)
  if (icerikler.length === 0) {
    return (
      <div className="flex h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-center">
        <div className="mb-4 rounded-full bg-white/10 p-4">
          <FaFilm className="text-3xl text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Sonuç Bulunamadı</h3>
        <p className="mt-2 max-w-xs text-gray-400">
          Bu kriterlere uygun içerik yok.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* İçerik Izgarası - Responsive kolon yapısı */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {icerikler.map((icerik) => (
          <ContentCard key={icerik.id} data={icerik} />
        ))}
      </div>

      {/* Sayfalama Bileşeni */}
      <Pagination totalCount={count} />
    </>
  );
}
