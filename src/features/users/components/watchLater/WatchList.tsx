import Link from "next/link";
import { FaRegBookmark, FaFilm } from "react-icons/fa6"; // Kalp yerine Bookmark ikonu
import { getWatchList } from "@/features/users/services/userService";
// Yolunu kendi projene göre kontrol et
import SavedContentCard from "../profile/SavedContentCard";

export default async function WatchList() {
  const watchList = await getWatchList();

  // --- BOŞ DURUM ---
  if (!watchList || watchList.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        {/* İkon */}
        <div className="relative mb-6">
          <div className="bg-secondary-1/20 absolute inset-0 animate-pulse rounded-full blur-xl"></div>
          <div className="border-secondary-1/30 bg-primary-900 relative flex h-20 w-20 items-center justify-center rounded-full border-2 shadow-2xl">
            <FaRegBookmark className="text-secondary-1 text-4xl" />
          </div>
        </div>

        {/* Yazılar */}
        <h2 className="text-primary-50 text-2xl font-bold">Listeniz Boş</h2>
        <p className="text-primary-400 mt-2 max-w-sm text-sm">
          Henüz izleme listenize hiç içerik eklemediniz.
        </p>

        {/* Buton */}
        <Link
          href="/icerikler"
          className="group bg-primary-50 text-primary-950 hover:bg-secondary-1 mt-6 flex items-center gap-2 rounded-full px-6 py-2.5 font-bold transition-all hover:shadow-lg active:scale-95"
        >
          <FaFilm />
          <span>Keşfetmeye Başla</span>
        </Link>
      </div>
    );
  }

  // --- LİSTE DURUMU ---
  return (
    <div className="w-full">
      {/* BAŞLIK ALANI - Renkler Düzeltildi */}
      <div className="border-primary-800 mb-6 flex items-center gap-3 border-b pb-4">
        <h1 className="text-primary-50 text-2xl font-bold">İzleme Listem</h1>

        {/* Sayı Rozeti: Okunabilir Kontrast */}
        <span className="bg-primary-800 text-secondary-1 border-primary-700 rounded-full border px-3 py-1 text-xs font-bold tracking-wide">
          {watchList.length} İçerik
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {watchList.map((item) => {
          // İlişkisel veri silinmişse kartı basma (Güvenlik)
          if (!item.icerikler) return null;

          return (
            <SavedContentCard
              key={item.icerikler_id}
              data={item.icerikler as any}
              type="watchLater" // Tipi watchLater olarak ayarladık
            />
          );
        })}
      </div>
    </div>
  );
}
