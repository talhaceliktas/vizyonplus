"use server";

import supabaseServer from "@/lib/supabase/server";
import supabaseAdmin from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createMockSubscription(paketId: number) {
  // Standart istemci (Kullanıcı yetkisiyle çalışır)
  const supabase = await supabaseServer();

  // 1. Kullanıcıyı doğrula (Standart)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Kullanıcı oturumu bulunamadı." };
  }

  // 2. Yeni Paket bilgisini çek (Standart - Herkes okuyabilir)
  const { data: yeniPaket } = await supabase
    .from("abonelik_paketleri")
    .select("sure_gun")
    .eq("id", paketId)
    .single();

  if (!yeniPaket) {
    return { success: false, error: "Geçersiz paket." };
  }

  // 3. Mevcut Aktif Aboneliği Kontrol Et (Standart - Kullanıcı kendi verisini görebilir)
  // BURADA DEĞİŞİKLİK YAPILDI: supabaseAdmin yerine supabase kullanıldı.
  const { data: mevcutAbonelik } = await supabase
    .from("kullanici_abonelikleri")
    .select("id")
    .eq("kullanici_id", user.id)
    .gte("bitis_tarihi", new Date().toISOString())
    .maybeSingle(); // single() yerine maybeSingle() daha güvenlidir (hata fırlatmaz, null döner)

  // 4. Tarih Hesaplamaları
  const baslangic = new Date();
  const bitis = new Date();
  bitis.setDate(baslangic.getDate() + yeniPaket.sure_gun);

  let error;

  // 5. Yazma İşlemleri (BURADA HALA ADMIN GEREKLİ)
  // Çünkü kullanıcının INSERT/UPDATE yetkisi yok (RLS kapalı).
  if (mevcutAbonelik) {
    // --- SENARYO A: YÜKSELTME (UPDATE) ---
    const updateResult = await supabaseAdmin
      .from("kullanici_abonelikleri")
      .update({
        paket_id: paketId,
        baslangic_tarihi: baslangic.toISOString(),
        bitis_tarihi: bitis.toISOString(),
        otomatik_yenileme: true,
        provider_abonelik_id: `mock_upgrade_${Date.now()}`,
      })
      .eq("id", mevcutAbonelik.id);

    error = updateResult.error;
  } else {
    // --- SENARYO B: YENİ ABONELİK (INSERT) ---
    const insertResult = await supabaseAdmin
      .from("kullanici_abonelikleri")
      .insert({
        kullanici_id: user.id, // Kullanıcı ID'sini auth'dan gelen güvenli ID'den alıyoruz
        paket_id: paketId,
        baslangic_tarihi: baslangic.toISOString(),
        bitis_tarihi: bitis.toISOString(),
        otomatik_yenileme: true,
        provider_abonelik_id: `mock_new_${Date.now()}`,
      });

    error = insertResult.error;
  }

  if (error) {
    console.error("Db hatası:", error);
    return { success: false, error: "İşlem başarısız oldu." };
  }

  revalidatePath("/profil");
  revalidatePath("/abonelikler");
  revalidatePath("/izle");

  return { success: true };
}
