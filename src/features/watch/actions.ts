"use server";

import supabaseServer from "@lib/supabase/server";

type IzlenmeGecmisiProps = {
  contentId: number;
  time: number;
  totalDuration: number;
  type: "film" | "dizi";
  episodeId?: number;
};

export async function updateWatchHistory({
  contentId,
  time,
  totalDuration,
  type,
  episodeId,
}: IzlenmeGecmisiProps) {
  const supabase = await supabaseServer();

  // 1. Kullanıcıyı kontrol et
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const izlenmeOrani = time / totalDuration;
  const bittiMi = izlenmeOrani > 0.95;

  // 3. Veritabanına kaydet (Upsert)
  const { error } = await supabase.from("izleme_gecmisi").upsert(
    {
      kullanici_id: user.id,
      // Eğer film ise contentId'yi film_id olarak kullan
      film_id: type === "film" ? contentId : null,
      // Eğer dizi ise ve episodeId varsa onu kullan
      bolum_id: type === "dizi" && episodeId ? episodeId : null,
      kalinan_saniye: time,
      toplam_saniye: totalDuration,
      bitti_mi: bittiMi,
      updated_at: new Date().toISOString(),
    },
    {
      // Hangi unique constraint'e göre güncelleme yapacağını belirtiyoruz
      onConflict:
        type === "film" ? "kullanici_id, film_id" : "kullanici_id, bolum_id",
    },
  );

  if (error) {
    console.error("İzleme kaydı hatası:", error.message);
  }
}
