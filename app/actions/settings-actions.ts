"use server";

import { revalidateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export async function updateSettings(formData) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Frontend'deki camelCase veriyi DB'deki snake_case formatına çeviriyoruz
  const dbData = {
    duyuru_aktif: formData.duyuruAktif,
    duyuru_metni: formData.duyuruMetni,
    duyuru_tipi: formData.duyuruTipi,
    bakim_modu: formData.bakimModu,
    yeni_uye_alimi: formData.yeniUyeAlimi,
    yorumlar_kilitli: formData.yorumlarKilitli,
  };

  try {
    const { error } = await supabase.from("ayarlar").update(dbData).eq("id", 1);

    if (error) throw error;

    // SİHİR BURADA: Cache'i temizle!
    // Bir sonraki istekte 'get-settings' yeniden DB'den çekecek.
    revalidateTag("site-settings");

    return { success: true };
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return { success: false, error };
  }
}
