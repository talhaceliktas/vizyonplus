/**
 * Bu bileşen, kullanıcının FAVORİLER sayfasındaki içerik listesini oluşturur.
 * Sunucudan (`getFavorites`) veriyi çeker ve `SavedContentCard` bileşenlerini listeler.
 * Liste boşsa, kullanıcıya öneri sunan bir "Boş Durum (Empty State)" ekranı gösterir.
 */

import Link from "next/link";
import { FaHeart, FaFilm } from "react-icons/fa6";
import { getFavorites } from "@/features/users/services/userService";
import SavedContentCard from "../profile/SavedContentCard";

export default async function FavoritesList() {
  const favorites = await getFavorites();

  // --- BOŞ DURUM (EMPTY STATE) ---
  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/20 blur-xl"></div>
          <div className="bg-primary-900 relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500/30 shadow-2xl">
            <FaHeart className="text-4xl text-red-500" />
          </div>
        </div>

        {/* Yazılar */}
        <h2 className="text-primary-50 text-2xl font-bold">Listeniz Boş</h2>
        <p className="text-primary-400 mt-2 max-w-sm text-sm">
          Henüz favorilerinize hiç içerik eklemediniz.
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

  return (
    <div className="w-full">
      <div className="border-primary-800 mb-6 flex items-center gap-3 border-b pb-4">
        <h1 className="text-primary-50 text-2xl font-bold">Favorilerim</h1>

        <span className="bg-primary-800 border-primary-700 rounded-full border px-3 py-1 text-xs font-bold tracking-wide text-red-500">
          {favorites.length} İçerik
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {favorites.map((item) => {
          if (!item.icerikler) return null;

          return (
            <SavedContentCard
              key={item.icerikler_id}
              data={item.icerikler as any}
              type="favorite"
            />
          );
        })}
      </div>
    </div>
  );
}
