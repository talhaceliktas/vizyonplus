"use client";

import { FaLock } from "react-icons/fa";

const YorumYapama = () => {
  return (
    <div className="flex w-full items-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-400">
      <div className="rounded-full bg-red-500/10 p-3">
        <FaLock className="text-xl" />
      </div>
      <div>
        <h4 className="font-bold">Yorumlar Kapalı</h4>
        <p className="text-xs text-red-400/70 sm:text-sm">
          Bu içerik için yorum yapma özelliği yönetici tarafından kapatılmıştır.
        </p>
      </div>
    </div>
  );
};

export default YorumYapama;
