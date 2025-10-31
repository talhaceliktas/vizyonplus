"use client";

import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useRef, useState } from "react";
import useDisariTiklamaAlgila from "../../../hooks/useDisariTiklamaAlgila";
import { RiEmojiStickerFill } from "react-icons/ri";
import { yorumYap } from "../../../_lib/data-service-client";
import toast from "react-hot-toast";

const YorumYap = ({ icerikId }: { icerikId: number }) => {
  const [yorum, setYorum] = useState("");
  const [spoilerVar, setSpoilerVar] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const { isOpen, setIsOpen } = useDisariTiklamaAlgila(emojiPickerRef);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setYorum((prev) => prev + emojiData.emoji);
  };

  async function yorumYapBasildi() {
    const durum = await yorumYap(icerikId, yorum, spoilerVar);
    if (!durum) {
      toast.error("Bir sorun oluştu!");
    } else {
      setYorum("");
      setSpoilerVar(false);
      toast.success("Yorumunuz başarıyla gönderildi.");
    }
  }

  return (
    <div className="border-primary-600 relative flex flex-col border-b-2 p-2 pb-10">
      <textarea
        value={yorum}
        onChange={(e) => setYorum(e.target.value)}
        className="border-primary-600 mt-4 w-full rounded-md border-2 bg-transparent p-2"
        placeholder="Lütfen yorumunuzu giriniz..."
        rows={10}
      />
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="absolute top-9 right-5 cursor-pointer text-2xl"
      >
        <RiEmojiStickerFill />
      </button>
      {isOpen && (
        <div className="absolute top-12 right-12 z-50" ref={emojiPickerRef}>
          <EmojiPicker theme={Theme.AUTO} onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className="relative mt-2 flex justify-between">
        <div className="flex items-center gap-x-10">
          <div className="flex items-center gap-x-2 text-xl">
            <input
              type="checkbox"
              id="spoilerVar"
              className="text-secondary-3 accent-secondary-1 h-4 w-4 cursor-pointer rounded border-white focus:ring-2 focus:outline-none"
              checked={spoilerVar}
              onChange={() => setSpoilerVar((e) => !e)}
            />
            <label className="cursor-pointer text-sm" htmlFor="spoilerVar">
              Yorumun Spoiler İçeriyor Mu?
            </label>
          </div>
        </div>
        <button
          onClick={yorumYapBasildi}
          disabled={yorum.length <= 3}
          className={`px-3 py-2 text-black duration-300 ${yorum.length <= 3 ? "bg-primary-400 cursor-not-allowed" : "bg-secondary-1 cursor-pointer"}`}
        >
          Yorum Yap
        </button>
      </div>
    </div>
  );
};

export default YorumYap;
