/**
 * Bu sayfa, DİZİ BÖLÜMÜ İZLEME sayfasır (`/izle/dizi/[slug]/[sezon]/[bolum]`).
 * Diziye ait spesifik bir bölümü oynatır.
 * Video Player, önceki/sonraki bölüm navigasyonu ve yorumları içerir.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import supabaseServer from "@/lib/supabase/server";

// Servisler
import {
  getEpisodeBySlug,
  getEpisodeWatchTime,
} from "@/features/watch/services";

// Bileşenler
import WatchNavbar from "@/features/watch/components/WatchNavbar";
import VideoPlayer from "@/features/watch/components/VideoPlayer";
import EpisodeComments from "@/features/watch/components/EpisodeComments";

interface PageProps {
  params: Promise<{
    icerikSlug: string;
    sezonId: string;
    bolumId: string;
  }>;
}

export default async function WatchEpisodePage({ params }: PageProps) {
  // Params Promise olduğu için await ediyoruz
  const { icerikSlug, sezonId, bolumId } = await params;

  const seasonNum = Number(sezonId);
  const episodeNum = Number(bolumId);

  // 1. Veriyi Çek (Bölüm, Dizi Bilgisi, Önceki/Sonraki var mı?)
  const data = await getEpisodeBySlug(icerikSlug, seasonNum, episodeNum);

  if (!data) return notFound();

  const { episode, content, hasPrev, hasNext } = data;

  // 2. İzleme Süresi (Kaldığı Yer) - Kullanıcı giriş yapmışsa
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let startTime = 0;
  if (user) {
    startTime = await getEpisodeWatchTime(user.id, episode.id);
  }

  // --- Navigasyon Linklerini Oluştur ---
  const prevLink = hasPrev
    ? `/izle/dizi/${icerikSlug}/${seasonNum}/${episodeNum - 1}`
    : null;

  const nextLink = hasNext
    ? `/izle/dizi/${icerikSlug}/${seasonNum}/${episodeNum + 1}`
    : null;

  const pageTitle = `${content.isim} - S${seasonNum}:B${episodeNum}`;

  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white lg:flex-row lg:overflow-hidden">
      {/* NAVBAR */}
      <WatchNavbar title={pageTitle} />

      {/* --- SOL: VİDEO & KONTROLLER --- */}
      <div className="flex w-full flex-col justify-center bg-black lg:h-screen lg:flex-1 lg:p-0">
        <div className="relative flex h-full w-full flex-col">
          {/* VİDEO OYNATICI */}
          <div className="relative flex flex-1 items-center justify-center bg-black">
            {/* 🔥 ÖNEMLİ: key={episode.id}
                Bu sayede bölüm değiştiğinde React player'ı tamamen sıfırlar.
                Eski videonun kalıntıları (buffer, süre vs.) kalmaz.
            */}
            <VideoPlayer
              key={episode.id}
              src={episode.video_url}
              poster={content.yan_fotograf || episode.fotograf}
              contentId={content.id}
              episodeId={episode.id}
              initialTime={startTime}
              contentType="dizi"
              seasonId={seasonNum}
            />
          </div>

          {/* NAVİGASYON BARI (Player Altı) */}
          <div className="flex h-16 shrink-0 items-center justify-between border-t border-white/10 bg-neutral-950 px-4 md:px-6">
            {/* ÖNCEKİ BÖLÜM */}
            <div className="flex-1">
              {prevLink ? (
                <Link
                  href={prevLink}
                  className="group flex w-max items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  <div className="hidden flex-col sm:flex">
                    <span className="text-[10px] tracking-wider uppercase opacity-60">
                      Önceki
                    </span>
                    <span>Bölüm {episodeNum - 1}</span>
                  </div>
                </Link>
              ) : (
                <div className="w-10" />
              )}
            </div>

            {/* BÖLÜM LİSTESİNE DÖN */}
            <Link
              href={`/izle/dizi/${icerikSlug}`}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-all hover:border-yellow-500/50 hover:bg-white/10 hover:text-yellow-500"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Bölüm Listesi</span>
            </Link>

            {/* SONRAKİ BÖLÜM */}
            <div className="flex flex-1 justify-end">
              {nextLink ? (
                <Link
                  href={nextLink}
                  className="group flex w-max items-center gap-2 text-right text-sm font-medium text-white transition-colors hover:text-yellow-500"
                >
                  <div className="hidden flex-col sm:flex">
                    <span className="text-[10px] tracking-wider uppercase opacity-60">
                      Sonraki
                    </span>
                    <span>Bölüm {episodeNum + 1}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <span className="cursor-default rounded bg-white/5 px-2 py-1 text-xs font-medium text-gray-600 select-none">
                  Sezon Sonu
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- SAĞ: YORUMLAR --- */}
      <div className="w-full border-l border-white/10 bg-neutral-950 lg:h-screen lg:w-[400px] lg:shrink-0 xl:w-[450px]">
        {/* Bölüm değiştiğinde yorumların da anında sıfırlanıp yenisinin yüklenmesi için key veriyoruz */}
        <EpisodeComments key={episode.id} episodeId={episode.id} />
      </div>
    </div>
  );
}
