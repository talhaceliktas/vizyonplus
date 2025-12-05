import { notFound } from "next/navigation";
import supabaseServer from "@/lib/supabase/server";
import { getContentBySlug } from "@content/services/contentService";

import WatchNavbar from "@/features/watch/components/WatchNavbar";
import VideoPlayer from "@/features/watch/components/VideoPlayer";
import CommentsSidebar from "@/features/watch/components/CommentsSidebar";

interface PageProps {
  params: {
    icerikSlug: string;
  };
}

export default async function WatchPage({ params }: PageProps) {
  const { icerikSlug } = await params;

  const movie = await getContentBySlug(icerikSlug);

  if (!movie || !movie.video_url) {
    return notFound();
  }

  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let startTime = 0;

  if (user) {
    const { data: watchRecord } = await supabase
      .from("izleme_gecmisi")
      .select("kalinan_saniye")
      .eq("kullanici_id", user.id)
      .eq("film_id", movie.id)
      .single();

    if (watchRecord) {
      startTime = watchRecord.kalinan_saniye;
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white lg:flex-row lg:overflow-hidden">
      <WatchNavbar title={movie.isim} />

      <div className="flex w-full flex-col justify-center bg-black lg:h-screen lg:flex-1">
        <div className="relative h-full w-full">
          <VideoPlayer
            src={movie.video_url}
            poster={movie.yan_fotograf ?? ""}
            contentId={movie.id}
            initialTime={startTime}
            contentType="film"
          />
        </div>
      </div>

      <div className="w-full border-l border-white/10 bg-neutral-950 lg:h-screen lg:w-[400px] lg:shrink-0 xl:w-[450px]">
        <CommentsSidebar contentId={movie.id} slug={icerikSlug} />
      </div>
    </div>
  );
}
