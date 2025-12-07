"use server";

import supabaseServer from "@/lib/supabase/server";
import supabaseAdmin from "@/lib/supabase/admin"; // Admin yetkisiyle güncellemek için
import { revalidatePath } from "next/cache";

export async function toggleSubscriptionRenewal() {
  // 1. Kullanıcıyı Doğrula
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Oturum açmanız gerekiyor." };
  }

  // 2. Mevcut Aboneliği Bul
  // En ileri tarihli (aktif) aboneliği çekiyoruz
  const { data: subscription } = await supabaseAdmin
    .from("kullanici_abonelikleri")
    .select("id, otomatik_yenileme")
    .eq("kullanici_id", user.id)
    .gte("bitis_tarihi", new Date().toISOString())
    .order("bitis_tarihi", { ascending: false })
    .limit(1)
    .single();

  if (!subscription) {
    return { success: false, error: "Aktif bir abonelik bulunamadı." };
  }

  // 3. Durumu Tersine Çevir (Toggle)
  const yeniDurum = !subscription.otomatik_yenileme;

  const { error } = await supabaseAdmin
    .from("kullanici_abonelikleri")
    .update({ otomatik_yenileme: yeniDurum })
    .eq("id", subscription.id);

  if (error) {
    console.error("Güncelleme hatası:", error);
    return { success: false, error: "İşlem sırasında bir hata oluştu." };
  }

  // 4. Sayfayı Yenile
  revalidatePath("/profil/abonelik");

  return {
    success: true,
    message: yeniDurum
      ? "Aboneliğin başarıyla yenilendi! Kesintisiz izlemeye devam edebilirsin."
      : "Aboneliğin iptal edildi. Dönem sonuna kadar izlemeye devam edebilirsin.",
  };
}
