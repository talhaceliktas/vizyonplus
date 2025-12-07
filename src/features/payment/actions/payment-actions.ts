"use server";

import supabaseServer from "@/lib/supabase/server";
import supabaseAdmin from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createMockSubscription(paketId: number) {
  const supabase = await supabaseServer();

  // 1. Kullanıcıyı doğrula
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Kullanıcı oturumu bulunamadı." };
  }

  // 2. Yeni Paket bilgisini çek
  const { data: yeniPaket } = await supabase
    .from("abonelik_paketleri")
    .select("sure_gun")
    .eq("id", paketId)
    .single();

  if (!yeniPaket) {
    return { success: false, error: "Geçersiz paket." };
  }

  // 3. Mevcut Aktif Aboneliği Kontrol Et
  const { data: mevcutAbonelik } = await supabaseAdmin
    .from("kullanici_abonelikleri")
    .select("id")
    .eq("kullanici_id", user.id)
    .gte("bitis_tarihi", new Date().toISOString())
    .single();

  // 4. Tarih Hesaplamaları
  const baslangic = new Date();
  const bitis = new Date();
  bitis.setDate(baslangic.getDate() + yeniPaket.sure_gun);

  let error;

  if (mevcutAbonelik) {
    // --- SENARYO A: YÜKSELTME (UPDATE) ---
    // Mevcut kaydı güncelle: Paket ID değişir, süre uzar.
    const updateResult = await supabaseAdmin
      .from("kullanici_abonelikleri")
      .update({
        paket_id: paketId,
        baslangic_tarihi: baslangic.toISOString(), // Yeni dönem başlangıcı
        bitis_tarihi: bitis.toISOString(), // Yeni dönem bitişi
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
        kullanici_id: user.id,
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
