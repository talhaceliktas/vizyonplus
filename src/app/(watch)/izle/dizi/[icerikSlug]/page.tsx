import { Suspense } from "react";
import { notFound } from "next/navigation";
import LoadingSpinner from "@shared/components/ui/LoadingSpinner";
import supabaseServer from "@/lib/supabase/server";

import {
  getContentBySlug,
  getUserContentInteractions,
  getContentAverageRating,
  getContentEpisodes,
} from "@/features/content/services/contentService";

import ContentHero from "@/features/content/components/details/ContentHero";
import ActionBar from "@/features/content/components/details/ActionBar";
import EpisodesList from "@/features/content/components/details/EpisodesList";
import Yorumlar from "@/features/content/components/comments/CommentsSection";

interface PageProps {
  params: Promise<{ icerikSlug: string }>;
}

export default async function ContentPage({ params }: PageProps) {
  const { icerikSlug } = await params;
  const supabase = await supabaseServer();

  // 1. Temel Verileri Çek (İçerik ve Kullanıcı)
  const [content, userResponse] = await Promise.all([
    getContentBySlug(icerikSlug),
    supabase.auth.getUser(),
  ]);

  if (!content) {
    return notFound();
  }

  const user = userResponse.data.user;

  // 2. Detay Verilerini Paralel Hazırla
  // Varsayılan boş etkileşim objesi (User yoksa bu döner)
  const defaultInteractions = {
    isSubscribed: false,
    userRating: null,
    watchHistory: null,
    voteStatus: null,
    favorite: false,
    watchLater: false,
  };

  // Promise dizisi yerine direkt değişkenlere atıyoruz, çok daha okunaklı.
  const averageRatingPromise = getContentAverageRating(content.id);

  const interactionsPromise = user
    ? getUserContentInteractions(user.id, content.id, content.tur)
    : Promise.resolve(defaultInteractions);

  const episodesPromise =
    content.tur === "dizi"
      ? getContentEpisodes(content.id)
      : Promise.resolve([]); // Film ise boş dizi dön, veritabanını yorma

  // 3. Hepsini Tek Seferde Bekle (Waterfall Önleme)
  const [averageRating, interactions, episodes] = await Promise.all([
    averageRatingPromise,
    interactionsPromise,
    episodesPromise,
  ]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <main className="min-h-screen bg-white pt-24 pb-20 text-gray-900 dark:bg-black dark:text-gray-50">
        <div className="mx-auto flex h-full w-full max-w-[1360px] flex-col gap-y-16 px-4 md:gap-y-20">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ContentHero content={content} />

            <ActionBar
              content={content}
              user={user}
              interactions={interactions}
              averageRating={averageRating}
            />
          </div>

          {/* DİZİ BÖLÜMLERİ (Sadece veri geldiyse render et) */}
          {episodes.length > 0 && (
            <div className="border-t border-gray-200 pt-10 dark:border-white/10">
              <div className="mb-6 flex items-center gap-2">
                <span className="h-8 w-1 rounded-full bg-yellow-500"></span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Bölümler
                </h3>
              </div>

              <EpisodesList
                episodes={episodes}
                slug={icerikSlug}
                isSubscribed={interactions.isSubscribed}
              />
            </div>
          )}

          {/* ALT KISIM (Yorumlar) */}
          <div className="border-t border-gray-200 pt-10 dark:border-white/10">
            <Yorumlar icerikId={content.id} slug={icerikSlug} />
          </div>
        </div>
      </main>
    </Suspense>
  );
}
