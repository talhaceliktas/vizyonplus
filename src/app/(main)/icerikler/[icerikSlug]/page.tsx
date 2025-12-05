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
  const interactionsPromise = user
    ? getUserContentInteractions(user.id, content.id, content.tur)
    : Promise.resolve({
        /* ...defaultlar... */
      });

  const averageRatingPromise = getContentAverageRating(content.id);

  const [interactions, averageRating] = await Promise.all([
    interactionsPromise,
    averageRatingPromise,
  ]);

  // DİKKAT: Yorumları burada ÇEKMİYORUZ!

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
