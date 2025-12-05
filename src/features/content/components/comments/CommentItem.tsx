"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface CommentItemProps {
  yorum: any;
  currentUserId?: string;
}

export default function CommentItem({
  yorum,
  currentUserId,
}: CommentItemProps) {
  const [isRevealed, setIsRevealed] = useState(!yorum.spoiler_mi);

  const avatarUrl = yorum.profiller?.profil_fotografi || "/default-avatar.png";
  const userName = yorum.profiller?.isim || "Anonim Kullanıcı";

  return (
    <div className="group flex gap-4">
      <div className="shrink-0">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 dark:border-white/10">
          <Image src={avatarUrl} alt={userName} fill className="object-cover" />
        </div>
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-200">
            {userName}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(yorum.olusturulma_zamani), {
              addSuffix: true,
              locale: tr,
            })}
          </span>
          {yorum.spoiler_mi && (
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-red-600 uppercase dark:bg-red-500/10 dark:text-red-500">
              Spoiler
            </span>
          )}
        </div>

        {/* Mesaj Alanı */}
        <div
          className={`text-sm leading-relaxed ${
            isRevealed
              ? "text-gray-800 dark:text-gray-300"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {isRevealed ? (
            <p className="wrap-break-words whitespace-pre-wrap">
              {yorum.yorum}
            </p>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-900/10">
              <p className="mb-2 font-medium text-red-500 dark:text-red-400">
                Bu yorum spoiler içermektedir.
              </p>
              <button
                onClick={() => setIsRevealed(true)}
                className="text-xs font-bold text-black underline-offset-4 hover:underline dark:text-white"
              >
                Yorumu Göster
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
