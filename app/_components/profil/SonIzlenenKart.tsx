import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function SonIzlenenKart({ kayit }) {
  const { icerik, yuzde, detay, tur, updated_at } = kayit;

  // İzleme butonuna gidecek URL
  const href =
    tur === "film" ? `/izle/film/${icerik.id}` : `/izle/dizi/${icerik.id}`; // Dizi ise detay sayfasına gitsin, oradan devam eder

  return (
    <div className="group relative flex gap-4 overflow-hidden rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:border-white/10 hover:bg-white/10">
      {/* Resim Alanı */}
      <div className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={icerik.fotograf}
          alt={icerik.isim}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Resim üzerindeki play ikonu */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <PlayCircle className="h-8 w-8 text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Bilgi Alanı */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="line-clamp-1 text-lg font-bold text-gray-100">
              {icerik.isim}
            </h3>
            <span className="shrink-0 rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold text-gray-400 uppercase">
              {tur}
            </span>
          </div>

          {/* Dizi ise Sezon/Bölüm Bilgisi */}
          {detay && (
            <p className="text-secondary-2 text-sm font-medium">{detay}</p>
          )}

          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(updated_at), {
                addSuffix: true,
                locale: tr,
              })}{" "}
              izlendi
            </span>
          </div>
        </div>

        {/* Progress Bar ve Buton */}
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-gray-400">Kalan Süre</span>
            <span className="font-bold text-gray-300">
              %{Math.round(yuzde)}
            </span>
          </div>

          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="bg-secondary-1-2 absolute top-0 left-0 h-full rounded-full"
              style={{ width: `${yuzde}%` }}
            />
          </div>

          <Link href={href} className="absolute inset-0 z-10" />
        </div>
      </div>
    </div>
  );
}
