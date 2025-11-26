"use client";

import { FaLock } from "react-icons/fa";

const YorumYapama = () => {
  return (
    <div className="border-primary-600 relative flex flex-col border-b-2 p-2 pb-10 opacity-70">
      <div className="relative mt-4 w-full">
        <textarea
          disabled={true}
          value=""
          className="border-primary-600 w-full cursor-not-allowed rounded-md border-2 bg-black/20 p-2 text-sm text-gray-500 blur-[1px] select-none sm:text-base dark:bg-black/40"
          placeholder="Bu içerik yorumlara kapatılmıştır."
          rows={10}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400">
          <div className="rounded-full bg-white/5 p-4 backdrop-blur-sm">
            <FaLock className="text-secondary-1 text-3xl" />
          </div>
          <span className="text-secondary-1 font-medium tracking-wide">
            Yorumlar Kapalı
          </span>
        </div>
      </div>

      <div className="relative mt-2 flex flex-col justify-between gap-y-3 opacity-50 sm:gap-y-0 md:flex-row">
        <div className="flex items-center gap-x-10">
          <div className="flex items-center gap-x-2 text-xl">
            <input
              disabled={true}
              type="checkbox"
              id="spoilerVar"
              className="text-secondary-3 accent-secondary-1 h-4 w-4 cursor-not-allowed rounded border-white focus:ring-2 focus:outline-none"
            />
            <label
              className="cursor-not-allowed text-sm text-gray-500"
              htmlFor="spoilerVar"
            >
              Yorumun Spoiler İçeriyor Mu?
            </label>
          </div>
        </div>

        <button
          disabled={true}
          className="bg-primary-800 cursor-not-allowed px-1 py-1 text-sm text-gray-400 duration-300 sm:px-3 sm:py-2 sm:text-base"
        >
          Yorum Yapılamaz
        </button>
      </div>
    </div>
  );
};

export default YorumYapama;
