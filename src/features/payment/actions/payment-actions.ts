"use server";

/**
 * Bu dosya, ödeme ve abonelik oluşturma işlemlerini yöneten sunucu eylemlerini (Server Actions) içerir.
 * Şu an için simülasyon (mock) bir ödeme akışı uygulamaktadır.
 * Admin yetkisi kullanarak kullanıcı aboneliklerini veritabanına yazar.
 */

import supabaseServer from "@/lib/supabase/server";
import supabaseAdmin from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/**
 * Sahte abonelik oluşturma işlemi.
 * Gerçekte burada Iyzico/Stripe kodu olurdu.
 * Bu fonksiyon veritabanına doğrudan kayıt atar.
 */
export async function createMockSubscription(paketId: number) {
  // 1. Standart İstemci ile Kullanıcıyı Doğrula
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Kullanıcı oturumu bulunamadı." };
  }

  // 2. Yeni Paket Bilgisini Çek (Süre bilgisini almak için)
  const { data: yeniPaket } = await supabase
    .from("abonelik_paketleri")
    .select("sure_gun")
    .eq("id", paketId)
    .single();

  if (!yeniPaket) {
    return { success: false, error: "Geçersiz paket." };
  }

  // 3. Mevcut Aktif Aboneliği Kontrol Et
  // Kullanıcının hali hazırda devam eden bir aboneliği var mı?
  const { data: mevcutAbonelik } = await supabase
    .from("kullanici_abonelikleri")
    .select("id")
    .eq("kullanici_id", user.id)
    .gte("bitis_tarihi", new Date().toISOString())
    .maybeSingle();

  // 4. Tarih Hesaplamaları
  const baslangic = new Date();
  const bitis = new Date();
  bitis.setDate(baslangic.getDate() + yeniPaket.sure_gun); // Paketin süresi kadar ekle (örn: 30 gün)

  let error;

  // 5. Veritabanı Yazma İşlemleri (Admin Yetkisi Gerekli)
  // RLS (Row Level Security) nedeniyle kullanıcılar genelde kendilerine abonelik ekleyemez, bunu sunucu yapar.
  if (mevcutAbonelik) {
    // --- SENARYO A: YÜKSELTME (UPDATE) ---
    // Mevcut abonelik varsa, süresini ve tipini güncelliyoruz.
    const updateResult = await supabaseAdmin
      .from("kullanici_abonelikleri")
      .update({
        paket_id: paketId,
        baslangic_tarihi: baslangic.toISOString(),
        bitis_tarihi: bitis.toISOString(), // Bitiş tarihi sıfırlanır (veya uzatılabilir, mantığa bağlı)
        otomatik_yenileme: true,
        provider_abonelik_id: `mock_upgrade_${Date.now()}`,
      })
      .eq("id", mevcutAbonelik.id);

    error = updateResult.error;
  } else {
    // --- SENARYO B: YENİ ABONELİK (INSERT) ---
    // Hiç abonelik yoksa yenisini oluşturuyoruz.
    const insertResult = await supabaseAdmin
      .from("kullanici_abonelikleri")
      .insert({
        kullanici_id: user.id, // Auth'dan gelen güvenli ID
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

  // 6. Önbellek Temizleme (Revalidation)
  // İlgili sayfaların güncel veriyi çekmesi için cache'i temizle
  revalidatePath("/profil");
  revalidatePath("/abonelikler");
  revalidatePath("/izle");

  return { success: true };
}
