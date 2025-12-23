"use server";

/**
 * Bu dosya, abonelik yönetimi için sunucu eylemlerini (Server Actions) içerir.
 * Kullanıcıların mevcut aboneliklerinin otomatik yenilenme özelliğini açıp kapatmalarını sağlar.
 */

import supabaseServer from "@/lib/supabase/server";
import supabaseAdmin from "@/lib/supabase/admin"; // Admin yetkisiyle güncellemek için
import { revalidatePath } from "next/cache";

/**
 * Kullanıcının aktif aboneliğinin otomatik yenilenme (auto-renew) ayarını değiştirir.
 * Eğer açıksa kapatır, kapalıysa açar.
 */
export async function toggleSubscriptionRenewal() {
  // 1. Kullanıcıyı ve Oturumu Doğrula
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Oturum açmanız gerekiyor." };
  }

  // 2. Mevcut Aktif Aboneliği Bul
  // En ileri tarihli (aktif) aboneliği çekiyoruz. Admin yetkisiyle okuma yapılıyor.
  const { data: subscription } = await supabaseAdmin
    .from("kullanici_abonelikleri")
    .select("id, otomatik_yenileme")
    .eq("kullanici_id", user.id)
    .gte("bitis_tarihi", new Date().toISOString()) // Süresi dolmamış
    .order("bitis_tarihi", { ascending: false }) // En son biteni al
    .limit(1)
    .single();

  if (!subscription) {
    return { success: false, error: "Aktif bir abonelik bulunamadı." };
  }

  // 3. Durumu Tersine Çevir (Toggle)
  const yeniDurum = !subscription.otomatik_yenileme;

  // Güncelleme işlemi (RLS politikaları nedeniyle admin yetkisi gerekebilir)
  const { error } = await supabaseAdmin
    .from("kullanici_abonelikleri")
    .update({ otomatik_yenileme: yeniDurum })
    .eq("id", subscription.id);

  if (error) {
    console.error("Güncelleme hatası:", error);
    return { success: false, error: "İşlem sırasında bir hata oluştu." };
  }

  // 4. Sayfayı Yenile (Cache temizle)
  // Profil/Abonelik sayfasındaki verinin güncel görünmesi için
  revalidatePath("/profil/abonelik");

  return {
    success: true,
    message: yeniDurum
      ? "Aboneliğin başarıyla yenilendi! Kesintisiz izlemeye devam edebilirsin."
      : "Aboneliğin iptal edildi. Dönem sonuna kadar izlemeye devam edebilirsin.",
  };
}
