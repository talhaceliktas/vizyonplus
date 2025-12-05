import { BiCommentDetail } from "react-icons/bi";
import supabaseServer from "@/lib/supabase/server";
import { getCachedSettings } from "@settings/services/settingsService";
import { getContentComments } from "@/features/content/services/commentService";

import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import AuthOverlay from "./AuthOverlay";

interface CommentsSectionProps {
  icerikId: number;
  slug: string;
}

export default async function CommentsSection({
  icerikId,
  slug,
}: CommentsSectionProps) {
  const supabase = await supabaseServer();

  const [userResponse, yorumlar, settings] = await Promise.all([
    supabase.auth.getUser(),
    getContentComments(icerikId),
    getCachedSettings(),
  ]);

  const user = userResponse.data.user;
  const isLocked = settings?.yorumlar_kilitli;

  return (
    <div className="flex flex-col gap-8" id="yorumlar">
      {/* BAŞLIK */}
      <div className="flex items-center justify-between">
        {/* Rengi dinamik yaptık */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Yorumlar ({yorumlar.length})
        </h3>
      </div>

      {/* YORUM FORMU KAPLAYICISI */}
      <div
        className={`relative transition-all duration-300 ${
          !user ? "pointer-events-none opacity-50 blur-[1px] select-none" : ""
        }`}
      >
        {isLocked ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-500 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            Yorumlar geçici olarak kapatılmıştır.
          </div>
        ) : (
          <CommentForm icerikId={icerikId} slug={slug} />
        )}
      </div>

      {/* LİSTE / UYARI */}
      {!user ? (
        <div className="mt-4 flex justify-center">
          <AuthOverlay />
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-10">
          {yorumlar.length > 0 ? (
            yorumlar.map((yorum: any) => (
              <CommentItem
                key={yorum.id}
                yorum={yorum}
                currentUserId={user?.id}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <BiCommentDetail className="mb-4 text-6xl opacity-20" />
              <p className="text-lg">Henüz yorum yapılmamış.</p>
              <p className="text-sm">İlk yorumu yapan sen ol!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
