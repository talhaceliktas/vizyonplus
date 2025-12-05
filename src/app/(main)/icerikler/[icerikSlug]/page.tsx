import { Suspense } from "react";
import { notFound } from "next/navigation";
import LoadingSpinner from "@shared/components/ui/LoadingSpinner";
import supabaseServer from "@/lib/supabase/server";

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const content = await getContentBySlug(icerikSlug);

  if (!content) {
    return notFound();
  }

  let interactions = {
    isSubscribed: false,
    userRating: null,
    watchHistory: null,
    voteStatus: null,
    favorite: false,
    watchLater: false,
  };

  let averageRating = { average: 0, count: 0 };

  if (user) {
    const [userInteractions, avgData] = await Promise.all([
      getUserContentInteractions(user.id, content.id, content.tur),
      getContentAverageRating(content.id),
    ]);
    interactions = userInteractions;
    averageRating = avgData;
  } else {
    averageRating = await getContentAverageRating(content.id);
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <main className="text-primary-50 min-h-screen px-4 pt-40 pb-20">
        <div className="mx-auto flex h-full w-full max-w-[1360px] flex-col gap-y-20">
          <div>
            <ContentHero content={content} />

            <ActionBar
              content={content}
              user={user}
              interactions={interactions}
              averageRating={averageRating}
            />
          </div>

          <div className="border-t border-white/10 pt-10">
            <CommentsSection icerikId={content.id} slug={icerikSlug} />
          </div>
        </div>
      </main>
    </Suspense>
  );
}
