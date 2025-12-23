/**
 * Bu bileşen, "Favorilere Ekle" ve "Listeme Ekle" butonlarını yan yana gösterir.
 * Kullanıcı giriş yapmamışsa, bu butonlar sembolik olarak görünür ve tıklanınca giriş sayfasına yönlendirir.
 */

import Link from "next/link";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa6";
import { User } from "@supabase/supabase-js";

import AddToWatchLaterButton from "@shared/components/ui/AddToWatchLaterButton";
import AddToFavoritesButton from "@shared/components/ui/AddToFavoritesButton";

interface ContentButtonsProps {
  user: User | null;
  id: number;
  favorite: boolean;
  watchLater: boolean;
}

export default function ContentButtons({
  user,
  id,
  favorite,
  watchLater,
}: ContentButtonsProps) {
  return (
    <div className="flex justify-end gap-x-2">
      {user ? (
        // Giriş yapmış kullanıcı için işlevsel butonlar
        <>
          <AddToFavoritesButton contentId={id} initialState={favorite} />
          <AddToWatchLaterButton contentId={id} initialState={watchLater} />
        </>
      ) : (
        // Giriş yapmamış kullanıcı için yönlendirme butonları
        <>
          <Link
            href="/giris"
            className="text-4xl transition-transform hover:scale-110"
          >
            <button className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 sm:h-12 sm:w-12">
              <FaRegHeart className="text-xl" />
            </button>
          </Link>
          <Link
            href="/giris"
            className="text-4xl transition-transform hover:scale-110"
          >
            <button className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 sm:h-12 sm:w-12">
              <FaRegBookmark className="text-xl" />
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
