/**
 * Bu sayfa, tek bir içeriğin (Film veya Dizi) DETAY SAYFASIDIR.
 * Dinamik route yapısı kullanır: `/icerikler/[icerikSlug]`
 *
 * YAPILAN İŞLEMLER:
 * 1. URL'den `icerikSlug` parametresini alır.
 * 2. `getContentBySlug` ile içeriğin detaylarını Supabase'den çeker.
 * 3. Kullanıcı giriş yapmışsa `getUserContentInteractions` ile etkileşimlerini (beğeni, puan, liste vb.) çeker.
 * 4. `Promise.all` kullanarak verileri paralel çeker (Waterfall'ı önler).
 * 5. Yorumları bu sayfada sunucudan ÇEKMEZ, Client Component olan `CommentsSection` içinde çeker (Suspense ile).
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import supabaseServer from "@/lib/supabase/server";

// Sadece ana verileri çeken fonksiyonlar
import {
  getContentBySlug,
  getUserContentInteractions,
  getContentAverageRating,
} from "@/features/content/services/contentService";

import ContentHero from "@/features/content/components/details/ContentHero";
import ActionBar from "@/features/content/components/details/ActionBar";
import CommentsSection from "@/features/content/components/comments/CommentsSection";

interface PageProps {
  params: Promise<{ icerikSlug: string }>;
}

export default async function ContentPage({ params }: PageProps) {
  // Next.js 15: params artık bir Promise, await ile çözümlenmeli
  const { icerikSlug } = await params;
  const supabase = await supabaseServer();

  // 1. KRİTİK VERİLER (Hero için lazım, beklemek zorundayız)
  const [content, userResponse] = await Promise.all([
    getContentBySlug(icerikSlug),
    supabase.auth.getUser(),
  ]);

  if (!content) return notFound();

  const user = userResponse.data.user;

  // 2. AKSİYON BAR VERİLERİ (Hızlı gelir, bekleyebiliriz)
  // Kullanıcı varsa etkileşimlerini çek, yoksa boş obje dön
  const interactionsPromise = user
    ? getUserContentInteractions(user.id, content.id, content.tur)
    : Promise.resolve({
        /* ...defaultlar... */
      });

  const averageRatingPromise = getContentAverageRating(content.id);

  // Etkileşimler ve ortalama puanı paralel bekle
  const [interactions, averageRating] = await Promise.all([
    interactionsPromise,
    averageRatingPromise,
  ]);

  // DİKKAT: Yorumları burada ÇEKMİYORUZ!
  // Yorumlar sayfanın en altında olduğu için, sayfa yükleme hızını düşürmemek adına
  // onları CommentsSection içinde ayrı bir fetch ile yapıyoruz ve Streaming (Suspense) kullanıyoruz.

  return (
    <main className="text-primary-50 min-h-screen px-4 pt-40 pb-20">
      <div className="mx-auto flex h-full w-full max-w-[1360px] flex-col gap-y-20">
        {/* BU KISIM VERİ GELDİĞİ İÇİN ANINDA RENDER OLUR */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ContentHero content={content} />
          <ActionBar
            content={content}
            user={user}
            interactions={interactions as any}
            averageRating={averageRating}
          />
        </div>

        {/* YORUMLAR BÖLÜMÜ (Streaming - Skeleton ile yükleniyor gösterir) */}
        <div className="border-t border-white/10 pt-10">
          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                <div className="bg-primary-700/50 h-8 w-32 animate-pulse rounded" />
                <div className="bg-primary-800/50 h-24 w-full animate-pulse rounded" />
                <div className="bg-primary-800/50 h-24 w-full animate-pulse rounded" />
              </div>
            }
          >
            <CommentsSection icerikId={content.id} slug={icerikSlug} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
