"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import ContentRate from "../../../content/components/details/ContentRate";

interface RatedContentCardProps {
  ratingId: number;
  rating: number;
  ratedAt: string;
  content: {
    id: number;
    slug: string;
    isim: string;
    fotograf: string | null;
    tur: string | null;
    yayinlanma_tarihi: string | null;
    aciklama: string | null;
  };
}

export default function RatedContentCard({
  rating,
  ratedAt,
  content,
}: RatedContentCardProps) {
  const formattedDate = new Date(ratedAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 sm:flex-row sm:items-start dark:bg-white/5 dark:shadow-none dark:ring-white/10 dark:hover:bg-white/10">
      {/* 1. RESİM ALANI */}
      <div className="relative aspect-2/3 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-32 dark:bg-gray-800">
        <Link href={`/icerikler/${content.slug}`}>
          {content.fotograf ? (
            <Image
              src={content.fotograf}
              alt={content.isim}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              Poster Yok
            </div>
          )}
        </Link>
      </div>

      {/* 2. BİLGİ ALANI */}
      <div className="flex flex-1 flex-col gap-3">
        {/* Başlık ve Metadata */}
        <div>
          <Link href={`/icerikler/${content.slug}`}>
            <h3 className="line-clamp-1 text-xl font-bold text-gray-900 transition-colors hover:text-yellow-600 dark:text-white dark:hover:text-yellow-500">
              {content.isim}
            </h3>
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
            {content.yayinlanma_tarihi && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(content.yayinlanma_tarihi).getFullYear()}
              </span>
            )}
            {content.tur && (
              <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600 uppercase dark:bg-white/10 dark:text-gray-300">
                {content.tur}
              </span>
            )}
          </div>
        </div>

        {/* Açıklama */}
        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {content.aciklama || "Açıklama bulunmuyor."}
        </p>

        {/* Alt Bilgi: Tarih */}
        <div className="mt-auto flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{formattedDate} tarihinde puanladın</span>
        </div>
      </div>

      {/* 3. PUANLAMA ALANI */}
      <div className="w-full sm:w-auto sm:min-w-[200px]">
        <ContentRate
          contentId={content.id}
          userRating={rating}
          averageRating={undefined}
        />
      </div>
    </div>
  );
}
