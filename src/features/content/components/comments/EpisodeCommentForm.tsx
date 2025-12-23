/**
 * Bu bileşen, DİZİ BÖLÜMLERİ için yorum yazma formudur.
 * `CommentForm` ile benzerdir ancak specifically `postEpisodeComment` action'ını kullanır.
 * Emoji seçici ve spoiler toggle içerir.
 */

"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { RiEmojiStickerLine, RiSendPlaneFill } from "react-icons/ri";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useClickOutside from "@hooks/useClickOutside";
import { postEpisodeComment } from "@/features/content/actions/content-actions";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface Props {
  episodeId: number;
}

export default function EpisodeCommentForm({ episodeId }: Props) {
  const [comment, setComment] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname(); // Revalidate için mevcut path gerekli
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useClickOutside(emojiPickerRef);

  const handleEmojiClick = (emojiData: any) => {
    setComment((prev) => prev + emojiData.emoji);
  };

  async function handleSubmit() {
    if (comment.trim().length <= 3) return;

    setLoading(true);
    // Action çağrısı: Bölüm yorumu ekle
    const result = await postEpisodeComment(
      episodeId,
      comment,
      isSpoiler,
      pathname,
    );
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setComment("");
      setIsSpoiler(false);
      setIsOpen(false);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="relative rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all duration-300 focus-within:border-yellow-500/50 focus-within:bg-black/40">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 min-h-12 w-full resize-none bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none"
        placeholder="Bölüm hakkında konuş..."
        rows={2}
      />

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Emoji */}
          <div className="relative" ref={emojiPickerRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors ${isOpen ? "text-yellow-500" : "text-gray-400 hover:text-white"}`}
            >
              <RiEmojiStickerLine size={20} />
            </button>
            {isOpen && (
              <div className="animate-in zoom-in-95 absolute bottom-8 left-0 z-50 duration-200">
                <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/50">
                  <EmojiPicker
                    theme={"dark" as any}
                    onEmojiClick={handleEmojiClick}
                    width={280}
                    height={350}
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Spoiler */}
          <button
            onClick={() => setIsSpoiler(!isSpoiler)}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
              isSpoiler
                ? "border border-red-500/20 bg-red-500/20 text-red-500"
                : "border border-transparent bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            {isSpoiler ? (
              <IoEyeOffOutline size={14} />
            ) : (
              <IoEyeOutline size={14} />
            )}
            <span>{isSpoiler ? "Spoiler" : "Normal"}</span>
          </button>
        </div>

        {/* Gönder */}
        <button
          onClick={handleSubmit}
          disabled={comment.trim().length <= 3 || loading}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold shadow-lg transition-all ${
            comment.trim().length > 3
              ? "bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95"
              : "cursor-not-allowed bg-white/5 text-gray-600"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <RiSendPlaneFill size={16} />
          )}
          <span>Gönder</span>
        </button>
      </div>
    </div>
  );
}
