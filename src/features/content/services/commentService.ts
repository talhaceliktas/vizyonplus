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
