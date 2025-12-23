/**
 * Bu bileşen, kullanıcıların yorum yazıp göndermesini sağlayan formdur.
 * Emoji seçici, Spoiler işaretleme ve karakter limiti kontrolü içerir.
 */

"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { RiEmojiStickerLine, RiSendPlaneFill } from "react-icons/ri";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useClickOutside from "@hooks/useClickOutside";
import { postComment } from "../../actions/content-actions";

// Emoji Picker'ı sadece client-side yükle (SSR hatasını önler)
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface CommentFormProps {
  icerikId: number;
  slug: string;
}

export default function CommentForm({ icerikId, slug }: CommentFormProps) {
  const [yorum, setYorum] = useState("");
  const [spoilerVar, setSpoilerVar] = useState(false);
  const [loading, setLoading] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  // Dışarı tıklayınca emoji picker'ı kapatan hook
  const { isOpen, setIsOpen } = useClickOutside(emojiPickerRef);

  const handleEmojiClick = (emojiData: any) => {
    setYorum((prev) => prev + emojiData.emoji);
  };

  async function handleSubmit() {
    if (yorum.trim().length <= 3) return;
    setLoading(true);
    const result = await postComment(icerikId, yorum, spoilerVar, slug);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setYorum("");
      setSpoilerVar(false);
      setIsOpen(false);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="relative rounded-xl border border-gray-200 bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 transition-all duration-300 focus-within:border-yellow-500 focus-within:bg-white dark:border-white/10 dark:bg-linear-to-br dark:from-white/10 dark:via-white/5 dark:to-transparent dark:backdrop-blur-md dark:focus-within:border-yellow-500/50 dark:focus-within:bg-black/40">
      <textarea
        value={yorum}
        onChange={(e) => setYorum(e.target.value)}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-white/10 min-h-16 w-full resize-none bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none sm:text-base dark:text-gray-200"
        placeholder="Bu içerik hakkında ne düşünüyorsun?"
        rows={3}
      />

      <div className="mt-3 flex items-center justify-between">
        {/* SOL ARAÇLAR: Emoji ve Spoiler */}
        <div className="flex items-center gap-2">
          {/* Emoji Butonu */}
          <div className="relative" ref={emojiPickerRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors ${
                isOpen
                  ? "text-yellow-500"
                  : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <RiEmojiStickerLine size={22} />
            </button>

            {/* Emoji Picker Popup */}
            {isOpen && (
              <div className="animate-in zoom-in-95 absolute bottom-10 left-0 z-50 duration-200">
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-2xl dark:border-white/10 dark:shadow-black/50">
                  <EmojiPicker
                    theme={"auto" as any}
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Spoiler Toggle Butonu */}
          <button
            onClick={() => setSpoilerVar(!spoilerVar)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
              spoilerVar
                ? "border border-red-500/20 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-500"
                : "border border-transparent bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
            }`}
          >
            {spoilerVar ? (
              <IoEyeOffOutline size={16} />
            ) : (
              <IoEyeOutline size={16} />
            )}
            <span>{spoilerVar ? "Spoiler" : "Normal"}</span>
          </button>
        </div>

        {/* GÖNDER BUTONU */}
        <button
          onClick={handleSubmit}
          disabled={yorum.trim().length <= 3 || loading}
          className={`flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-bold shadow-lg transition-all ${
            yorum.trim().length > 3
              ? "bg-yellow-500 text-black shadow-yellow-500/20 hover:scale-105 hover:bg-yellow-400 active:scale-95"
              : "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400 dark:border-white/5 dark:bg-white/5 dark:text-gray-600"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <RiSendPlaneFill size={18} />
              <span className="hidden sm:inline">Gönder</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
