/**
 * Bu bileşen, kullanıcının kaydettiği içerikleri (Favoriler veya Daha Sonra İzle) gösteren karttır.
 * `type` prop'una göre ("favorite" veya "watchLater") ilgili butonu ve işlevselliği sunar.
 */

import Image from "next/image";
import Link from "next/link";
import { FaPlay } from "react-icons/fa6";
import AddToFavoritesButton from "@/shared/components/ui/AddToFavoritesButton";
import AddToWatchLaterButton from "../../../../shared/components/ui/AddToWatchLaterButton";
import { Table } from "@/types";

interface SavedContentCardProps {
  data: Table<"icerikler">; // Gösterilecek içerik verisi
  type: "favorite" | "watchLater"; // Hangi listede olduğunu belirtir
}

const SavedContentCard = ({ data, type }: SavedContentCardProps) => {
  const { id, isim, fotograf, tur, turler, aciklama, slug } = data;

  // İçerik türüne göre izleme linkini oluştur
  const linkHref = tur === "film" ? `/izle/film/${slug}` : `/izle/dizi/${slug}`;

  return (
    <div className="group border-primary-800 bg-primary-900 hover:border-secondary-1/50 relative flex w-full flex-col overflow-hidden rounded-xl border transition-all hover:shadow-2xl sm:h-48 sm:flex-row">
      {/* SOL: Resim Alanı */}
      <Link
        href={linkHref}
        className="relative block h-40 w-full shrink-0 sm:h-full sm:w-36"
      >
        <Image
          src={fotograf}
          alt={isim}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play Overlay (Hover'da görünür) */}
        <div className="bg-primary-50/20 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <div className="bg-secondary-2 text-primary-50 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110">
            <FaPlay className="pl-1 text-sm" />
          </div>
        </div>
      </Link>

      {/* SAĞ: Bilgiler ve Buton */}
      <div className="flex flex-1 flex-col">
        {/* ÜST: Metin İçerikleri */}
        <div className="flex-1 p-4 pb-0">
          <Link href={linkHref}>
            <h3 className="text-primary-50 group-hover:text-secondary-1 line-clamp-1 text-lg font-bold transition-colors">
              {isim}
            </h3>
          </Link>

          {/* Türler Etiketi */}
          <div className="mt-2 flex gap-2">
            {turler?.slice(0, 2).map((t, i) => (
              <span
                key={i}
                className="bg-primary-800 text-primary-400 rounded px-2 py-0.5 text-[10px] tracking-wider uppercase"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Açıklama */}
          <p className="text-primary-500 mt-2 line-clamp-2 text-xs leading-relaxed">
            {aciklama}
          </p>
        </div>

        {/* ALT: Buton Alanı (Footer) */}
        {/* mt-auto ile her zaman kartın altına yaslanır */}
        <div className="border-primary-800 mt-auto flex justify-end border-t px-4 py-3">
          {type === "favorite" ? (
            <AddToFavoritesButton contentId={id} initialState={true} />
          ) : (
            <AddToWatchLaterButton contentId={id} initialState={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedContentCard;
