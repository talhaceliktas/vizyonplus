"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidateTag } from "next/cache";

// Tip tanımını, Client'taki state ile birebir eşleşecek şekilde (camelCase) yapıyoruz.
interface SettingsFormData {
  duyuruAktif: boolean;
  duyuruMetni: string;
  duyuruTipi: string;
  bakimModu: boolean;
  yeniUyeAlimi: boolean;
  yorumlarKilitli: boolean;
  // Player ayarları DB'de yoksa buraya eklemene gerek yok,
  // çünkü aşağıdaki mapping işleminde sadece DB'deki kolonları alacağız.
}

export async function updateSettings(formData: SettingsFormData) {
  // Admin yetkisiyle işlem yapmak için Service Role Key kullanıyoruz
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Mapping: Frontend (camelCase) -> DB (snake_case)
  const dbData = {
    duyuru_aktif: formData.duyuruAktif,
    duyuru_metni: formData.duyuruMetni,
    duyuru_tipi: formData.duyuruTipi,
    bakim_modu: formData.bakimModu,
    yeni_uye_alimi: formData.yeniUyeAlimi,
    yorumlar_kilitli: formData.yorumlarKilitli,
  };

  try {
    // ID'si 1 olan satırı güncelliyoruz
    const { error } = await supabase.from("ayarlar").update(dbData).eq("id", 1);

    if (error) throw error;

    // Cache temizliği
    revalidateTag("site-settings");

    return { success: true };
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {
      success: false,
      error: (error as any)?.message || "Veritabanı güncellenemedi.",
    };
  }
}
