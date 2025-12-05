"use server";

import supabaseServer from "@lib/supabase/server";

export async function voteContent(contentId: number, voteType: boolean | null) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Giriş yapmalısınız." };

  if (voteType === null) {
    const { error } = await supabase
      .from("begeniler")
      .delete()
      .eq("kullanici_id", user.id)
      .eq("icerik_id", contentId);

    if (error) return { success: false, error: error.message };
    return { success: true, removed: true };
  }

  const { error } = await supabase.from("begeniler").upsert(
    {
      kullanici_id: user.id,
      icerik_id: contentId,
      durum: voteType,
    },
    { onConflict: "kullanici_id, icerik_id" },
  );

  if (error) return { success: false, error: error.message };
  return { success: true, removed: false };
}

export async function rateContent(contentId: number, rating: number) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Giriş yapmalısınız." };

  const { error } = await supabase.from("icerik_puanlari").upsert(
    {
      kullanici_id: user.id,
      icerik_id: contentId,
      puan: rating,
    },
    {
      onConflict: "kullanici_id, icerik_id",
    },
  );

  if (error) return { success: false, error: error.message };

  return { success: true };
}
