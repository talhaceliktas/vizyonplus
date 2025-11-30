"use client";

import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useRef, useState } from "react";
import useDisariTiklamaAlgila from "../../../hooks/useDisariTiklamaAlgila";
import { RiEmojiStickerLine, RiSendPlaneFill } from "react-icons/ri";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { yorumYap } from "../../../_lib/data-service-client";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

type YorumYapProps = {
  icerikId: number;
  variant?: "default" | "compact";
};

const YorumYap = ({ icerikId, variant = "default" }: YorumYapProps) => {
  const [yorum, setYorum] = useState("");
  const [spoilerVar, setSpoilerVar] = useState(false);
  const [loading, setLoading] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useDisariTiklamaAlgila(emojiPickerRef);

  const isCompact = variant === "compact";

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setYorum((prev) => prev + emojiData.emoji);
    // Compact modda emoji seçince kapanması daha iyi bir deneyim olabilir,
    // ama seri emoji atmak için açık da bırakabiliriz. Şimdilik açık bırakıyorum.
    // setIsOpen(false);
  };

  async function yorumYapBasildi() {
    if (yorum.trim().length <= 3) return;

    setLoading(true);
    const durum = await yorumYap(icerikId, yorum, spoilerVar);
    setLoading(false);

    if (!durum) {
      toast.error("Bir sorun oluştu!");
    } else {
      setYorum("");
      setSpoilerVar(false);
      setIsOpen(false); // Gönderince emoji picker'ı kapat
      toast.success("Yorum gönderildi.");
    }
  }

  return (
    <div
      className={`relative border border-white/10 bg-[#121212] transition-colors focus-within:border-yellow-500/50 ${
        isCompact ? "rounded-lg p-2" : "rounded-xl p-4"
      }`}
    >
      {/* Text Area */}
      <textarea
        value={yorum}
        onChange={(e) => setYorum(e.target.value)}
        className={`scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 w-full resize-none bg-transparent text-gray-200 placeholder-gray-600 outline-none ${
          isCompact
            ? "min-h-[2.5rem] text-xs"
            : "min-h-[4rem] text-sm sm:text-base"
        }`}
        placeholder={
          isCompact ? "Bir şeyler yaz..." : "Düşüncelerini paylaş..."
        }
        rows={isCompact ? 1 : 3}
      />

      {/* Alt Kontroller */}
      <div
        className={`flex items-center justify-between ${isCompact ? "mt-2" : "mt-3"}`}
      >
        {/* Sol Taraf: Araçlar */}
        <div className="flex items-center gap-2">
          {/* Emoji */}
          <div className="relative">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className={`text-gray-400 transition hover:text-yellow-500 ${isCompact ? "p-1" : ""}`}
            >
              <RiEmojiStickerLine size={isCompact ? 18 : 22} />
            </button>

            {isOpen && (
              <div
                className="absolute bottom-10 left-0 z-50 shadow-2xl"
                ref={emojiPickerRef}
              >
                <EmojiPicker
                  theme={Theme.DARK}
                  onEmojiClick={handleEmojiClick}
                  width={isCompact ? 250 : 300}
                  height={isCompact ? 300 : 400}
                  searchDisabled={isCompact} // Compact modda aramayı kapatıp yer kazanabiliriz
                  previewConfig={{ showPreview: !isCompact }} // Compact modda önizlemeyi kapat
                />
              </div>
            )}
          </div>

          {/* Spoiler Toggle */}
          <button
            onClick={() => setSpoilerVar(!spoilerVar)}
            className={`flex items-center gap-1.5 rounded-full font-medium transition ${
              spoilerVar
                ? "bg-red-500/20 text-red-500"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            } ${isCompact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}`}
            title="Spoiler içeriyor olarak işaretle"
          >
            {spoilerVar ? (
              <IoEyeOffOutline size={isCompact ? 14 : 16} />
            ) : (
              <IoEyeOutline size={isCompact ? 14 : 16} />
            )}
            <span>
              {spoilerVar ? "Spoiler" : isCompact ? "Gizle" : "Normal"}
            </span>
          </button>
        </div>

        {/* Sağ Taraf: Gönder */}
        <button
          onClick={yorumYapBasildi}
          disabled={yorum.trim().length <= 3 || loading}
          className={`flex items-center gap-2 rounded-lg font-bold transition-all ${
            yorum.trim().length > 3
              ? "bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95"
              : "cursor-not-allowed bg-white/10 text-gray-500"
          } ${isCompact ? "p-1.5" : "px-4 py-2 text-sm"}`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={isCompact ? 16 : 18} />
          ) : (
            <RiSendPlaneFill size={isCompact ? 16 : 18} />
          )}
          {/* Default modda yazı görünsün, Compact modda sadece ikon */}
          {!isCompact && <span className="hidden sm:inline">Gönder</span>}
        </button>
      </div>
    </div>
  );
};

export default YorumYap;
