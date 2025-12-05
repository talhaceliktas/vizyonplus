"use server";

import supabaseServer from "@lib/supabase/server";

export async function getContentComments(contentId: number) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("yorumlar")
    .select(
      `
      *,
      profiller (
        isim,
        profil_fotografi
      )
    `,
    )
    .eq("icerik_id", contentId)
    .order("olusturulma_zamani", { ascending: false });

  if (error) {
    console.error("Yorum çekme hatası:", error.message);
    return [];
  }

  return data || [];
}

export async function getEpisodeComments(episodeId: number) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("bolum_yorumlari") // Dizi bölümleri için özel tablo
    .select(
      `
      *,
      profiller (
        isim,
        profil_fotografi
      )
    `,
    )
    .eq("bolum_id", episodeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Bölüm yorumları hatası:", error.message);
    return [];
  }

  return data || [];
}
