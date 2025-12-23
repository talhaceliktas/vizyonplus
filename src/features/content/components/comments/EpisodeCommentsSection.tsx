/**
 * Bu bileşen, dizi BÖLÜMLERİ için özelleştirilmiş yorum alanıdır.
 * `EpisodeCommentForm` ve yorum listesini içerir.
 * Bölüm izleme sayfasında sidebar içinde kullanılır.
 */

import { BiCommentDetail } from "react-icons/bi";
import supabaseServer from "@/lib/supabase/server";
import { getEpisodeComments } from "../../services/commentService";

import CommentItem from "./CommentItem";
import EpisodeCommentForm from "./EpisodeCommentForm";
import AuthOverlay from "./AuthOverlay";

interface Props {
  episodeId: number;
}

export default async function EpisodeCommentsSection({ episodeId }: Props) {
  const supabase = await supabaseServer();

  const [userResponse, comments] = await Promise.all([
    supabase.auth.getUser(),
    getEpisodeComments(episodeId),
  ]);

  const user = userResponse.data.user;

  return (
    <div className="flex h-full flex-col">
      {/* LİSTE ALANI (Yukarıda kalır ve scroll edilebilir) */}
      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 flex-1 overflow-y-auto p-4">
        {!user ? (
          <div className="flex h-full items-center justify-center">
            <AuthOverlay />
          </div>
        ) : comments.length > 0 ? (
          <div className="flex flex-col gap-4">
            {comments.map((comment: any) => (
              <CommentItem
                key={comment.id}
                yorum={comment}
                currentUserId={user.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 opacity-60">
            <BiCommentDetail className="mb-2 text-4xl" />
            <p className="text-sm">Henüz yorum yok.</p>
          </div>
        )}
      </div>

      {/* FORM ALANI (Sticky Bottom - En alta yapışık) */}
      {user && (
        <div className="border-t border-white/10 bg-neutral-900 p-4">
          <EpisodeCommentForm episodeId={episodeId} />
        </div>
      )}
    </div>
  );
}
