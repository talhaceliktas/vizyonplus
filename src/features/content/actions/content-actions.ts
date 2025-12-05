"use server";

import supabaseServer from "@lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function postComment(
  icerikId: number,
  yorum: string,
  spoilerMi: boolean,
  slug: string, // Sayfayı yenilemek için slug lazım
) {
  const supabase = await supabaseServer();

  // 1. Kullanıcı Kontrolü
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: "Giriş yapmalısınız." };
  }

  // 2. Yorumu Kaydet
  const { error } = await supabase.from("yorumlar").insert([
    {
      icerik_id: icerikId,
      kullanici_id: user.id,
      yorum: yorum,
      spoiler_mi: spoilerMi,
    },
  ]);

  if (error) {
    return { success: false, message: "Yorum gönderilemedi." };
  }

  // 3. Sayfayı Yenile (Cache Temizle)
  revalidatePath(`/icerikler/${slug}`);

  return { success: true, message: "Yorumunuz paylaşıldı." };
}

export async function postEpisodeComment(
  episodeId: number,
  comment: string,
  isSpoiler: boolean,
  path: string,
) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Giriş yapmalısınız." };

  const { error } = await supabase.from("bolum_yorumlari").insert({
    bolum_id: episodeId,
    kullanici_id: user.id,
    yorum: comment,
    spoiler_mi: isSpoiler,
  });

  if (error) {
    console.error("Yorum Hatası:", error);
    return { success: false, message: "Yorum gönderilemedi." };
  }

  revalidatePath(path);
  return { success: true, message: "Yorumunuz paylaşıldı." };
}
