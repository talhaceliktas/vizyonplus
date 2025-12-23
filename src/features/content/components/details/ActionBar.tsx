/**
 * Bu bileşen, içerik detay sayfasında aksiyon butonlarını (Oynat, Listeme Ekle, Puanla vb.)
 * ve kullanıcı etkileşimlerini organize eden sarmalayıcı bileşendir.
 * Tüm etkileşim verilerini (interactions) alt bileşenlere dağıtır.
 */

import { Table } from "@/types";

import WatchButton from "./WatchButton";
import ContentButtons from "./ContentButtons";
import ContentVote from "./ContentVote";
import ContentRate from "./ContentRate";

interface ActionBarProps {
  content: Table<"icerikler"> & { film_ucretleri?: any[] };
  user: any; // Supabase User objesi
  interactions: {
    isSubscribed: boolean; // Kullanıcının aktif aboneliği var mı?
    userRating: number | null; // Kullanıcının verdiği puan
    watchHistory: any; // İzleme geçmişi verisi (kaldığı yer vb.)
    voteStatus: boolean | null; // Beğenme durumu (true: like, false: dislike)
    watchLater: boolean; // İzleme listesinde mi?
    favorite: boolean; // Favorilerde mi?
  };
  averageRating: {
    average: number; // Ortalama puan
    count: number; // Oy sayısı
  };
}

export default function ActionBar({
  content,
  user,
  interactions,
  averageRating,
}: ActionBarProps) {
  const { isSubscribed, watchHistory, userRating, voteStatus } = interactions;

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* ÜST SATIR: Büyük Oynat Butonu */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <WatchButton
            slug={content.slug}
            aboneMi={isSubscribed}
            tur={content.tur}
            sonIzlenen={watchHistory}
          />
        </div>
      </div>

      {/* ALT SATIR: Butonlar ve Puanlama */}
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        {/* SOL: Etkileşim Butonları */}
        <div className="flex items-center gap-x-4">
          <ContentButtons
            id={content.id}
            user={user}
            favorite={interactions.favorite}
            watchLater={interactions.watchLater}
          />

          <ContentVote contentId={content.id} currentStatus={voteStatus} />
        </div>

        {/* SAĞ: Puanlama Alanı (Sadece giriş yapmış kullanıcılar) */}
        {user && (
          <div className="flex justify-start md:justify-end">
            <ContentRate
              contentId={content.id}
              userRating={userRating}
              averageRating={averageRating}
            />
          </div>
        )}
      </div>
    </div>
  );
}
