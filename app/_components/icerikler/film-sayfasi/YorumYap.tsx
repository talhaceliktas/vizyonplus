"use client";

import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useRef, useState } from "react";
import useDisariTiklamaAlgila from "../../../hooks/useDisariTiklamaAlgila";

const YorumYap = () => {
  const [yorum, setYorum] = useState("");

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const { isOpen, setIsOpen } = useDisariTiklamaAlgila(emojiPickerRef);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setYorum((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="border-primary-600 relative flex flex-col border-b-2 p-2">
      <textarea
        value={yorum}
        onChange={(e) => setYorum(e.target.value)}
        className="border-primary-600 mt-4 w-full rounded-md border-2 bg-transparent p-2"
        placeholder="Lütfen yorumunuzu giriniz..."
      />

      <div className="relative mt-2 inline-block">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="cursor-pointer text-2xl"
        >
          😉
        </button>

        {isOpen && (
          <div className="absolute top-7 left-7 z-50" ref={emojiPickerRef}>
            <EmojiPicker theme={Theme.AUTO} onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default YorumYap;
