"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Lock } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Episode {
  id: number;
  sezon_numarasi: number;
  bolum_numarasi: number;
  baslik: string;
  aciklama: string;
  sure: number;
  fotograf: string;
  yayin_tarihi: string;
}

interface EpisodesListProps {
  episodes: Episode[];
  slug: string;
  isSubscribed: boolean;
}

export default function EpisodesList({
  episodes,
  slug,
  isSubscribed,
}: EpisodesListProps) {
  // 1. Mevcut Sezonları Çıkar (Benzersizleri al ve sırala)
  const seasons = Array.from(
    new Set(episodes.map((e) => e.sezon_numarasi)),
  ).sort((a, b) => a - b);

  const [activeSeason, setActiveSeason] = useState(seasons[0] || 1);

  // 2. Aktif sezonun bölümlerini filtrele
  const activeEpisodes = episodes.filter(
    (e) => e.sezon_numarasi === activeSeason,
  );

  if (episodes.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {/* --- SEZON TABLARI --- */}
      <div className="scrollbar-hide flex items-center gap-4 overflow-x-auto border-b border-gray-200 pb-1 dark:border-white/10">
        {seasons.map((season) => (
          <button
            key={season}
            onClick={() => setActiveSeason(season)}
            className={`px-4 py-2 text-lg font-bold whitespace-nowrap transition-all duration-300 ${
              activeSeason === season
                ? "border-b-4 border-yellow-500 text-gray-900 dark:text-white"
                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            }`}
          >
            {season}. Sezon
          </button>
        ))}
      </div>

      {/* --- BÖLÜM LİSTESİ --- */}
      <div className="relative grid gap-4">
        {/* ABONE DEĞİLSE BLUR OVERLAY */}
        {!isSubscribed && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-white/60 backdrop-blur-sm dark:bg-black/60">
            <Lock className="mb-4 h-12 w-12 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Bölümleri Görmek İçin Abone Ol
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Vizyon+ dünyasına katıl ve tüm içeriklere eriş.
            </p>
            <Link
              href="/abonelikler"
              className="rounded-full bg-yellow-500 px-8 py-3 font-bold text-black shadow-lg transition-transform hover:scale-105 hover:bg-yellow-400"
            >
              Abone Ol
            </Link>
          </div>
        )}

        {/* LİSTE */}
        <div
          className={
            !isSubscribed ? "pointer-events-none opacity-50 select-none" : ""
          }
        >
          {activeEpisodes.map((episode) => (
            <Link
              key={episode.id}
              href={`/izle/dizi/${slug}/${episode.sezon_numarasi}/${episode.bolum_numarasi}`}
              className="group flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:border-yellow-500/50 hover:bg-white hover:shadow-lg md:flex-row dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
            >
              {/* SOL: Resim */}
              <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg md:w-48">
                <Image
                  src={episode.fotograf || "/placeholder-episode.jpg"} // Placeholder eklemeyi unutma
                  alt={episode.baslik}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                    <Play className="fill-white text-white" size={24} />
                  </div>
                </div>
              </div>

              {/* ORTA: Bilgiler */}
              <div className="flex flex-1 flex-col gap-2 text-center md:text-left">
                <div className="flex flex-col justify-between gap-1 md:flex-row md:items-center">
                  <h4 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-yellow-600 dark:text-white dark:group-hover:text-yellow-500">
                    {episode.bolum_numarasi}. {episode.baslik}
                  </h4>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {episode.sure} dk
                  </span>
                </div>

                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {episode.aciklama}
                </p>

                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {episode.yayin_tarihi &&
                    format(new Date(episode.yayin_tarihi), "d MMMM yyyy", {
                      locale: tr,
                    })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
