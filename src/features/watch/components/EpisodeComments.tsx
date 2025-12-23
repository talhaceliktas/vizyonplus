/**
 * Bu bileşen, dizilerde belirli bir bölüme ait yorumları gösteren kenar çubuğudur.
 * `EpisodeCommentsSection` bileşenini sarar ve başlık/tasarım ekler.
 */

import EpisodeCommentsSection from "@content/components/comments/EpisodeCommentsSection";

interface Props {
  episodeId: number;
}

export default function EpisodeComments({ episodeId }: Props) {
  return (
    <div className="flex h-full w-full flex-col border-l border-white/10 bg-neutral-900/50 pt-20 lg:pt-24">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-neutral-900/80 px-6 py-4 backdrop-blur-md">
        <h2 className="text-sm font-bold tracking-widest text-gray-200 uppercase">
          Bölüm Yorumları
        </h2>
        {/* Canlı İkonu */}
        <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <span className="text-[10px] font-bold tracking-wider text-green-400 uppercase">
            Canlı
          </span>
        </div>
      </div>

      {/* İçerik (Liste + Form) */}
      <div className="flex-1 overflow-hidden">
        <EpisodeCommentsSection episodeId={episodeId} />
      </div>
    </div>
  );
}
