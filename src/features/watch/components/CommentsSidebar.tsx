/**
 * Bu bileşen, izleme sayfasında (Watch Page) video player'ın yanında veya altında yer alan
 * genel yorumlar bölümünü saran bir kenar çubuğudur (sidebar).
 * Film izleme sayfalarında kullanılır.
 */

import CommentsSection from "../../content/components/comments/CommentsSection";

interface CommentsSidebarProps {
  contentId: number;
  slug: string;
}

export default function CommentsSidebar({
  contentId,
  slug,
}: CommentsSidebarProps) {
  return (
    <div className="flex h-full w-full flex-col bg-neutral-900/50 pt-20 lg:pt-24">
      {/* Başlık Alanı */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h2 className="text-sm font-bold tracking-widest text-gray-200 uppercase">
          Yorumlar
        </h2>
        {/* Canlı Göstergesi (Görsel efekt) */}
        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <span className="text-[10px] font-bold text-green-400 uppercase">
            Canlı
          </span>
        </div>
      </div>

      {/* Yorumlar Listesi (Scroll edilebilir alan) */}
      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 flex-1 overflow-y-auto p-4">
        <CommentsSection icerikId={contentId} slug={slug} />
      </div>
    </div>
  );
}
