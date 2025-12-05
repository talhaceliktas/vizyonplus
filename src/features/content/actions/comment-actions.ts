"use server";

import { revalidatePath } from "next/cache";
import supabaseServer from "../../../lib/supabase/server";

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
      user_id: user.id,
      yorum: yorum,
      spoiler_mi: spoilerMi,
    },
  ]);

  if (error) {
    console.error("Yorum Hatası:", error);
    return { success: false, message: "Yorum gönderilemedi." };
  }

  // 3. Sayfayı Yenile (Cache Temizle)
  revalidatePath(`/icerikler/${slug}`);

  return { success: true, message: "Yorumunuz paylaşıldı." };
}
