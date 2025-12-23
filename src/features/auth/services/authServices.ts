/**
 * Bu dosya, kimlik doğrulama ile ilgili yardımcı servis fonksiyonlarını içerir.
 */

"use server";

import supabaseServer from "../../../lib/supabase/server";

/**
 * Belirtilen kullanıcının GEÇERLİ bir aboneliği olup olmadığını kontrol eder.
 * Bitiş tarihi bugünden ileri bir tarih olan abonelikleri arar.
 */
export async function getCurrentSubscription(userId: string) {
  const supabase = await supabaseServer();

  const simdi = new Date().toISOString();

  // Aktif aboneliği ve paket detaylarını getir
  const { data, error } = await supabase
    .from("kullanici_abonelikleri")
    .select("*, abonelik_paketleri(*)")
    .eq("kullanici_id", userId)
    .gt("bitis_tarihi", simdi) // Bitiş tarihi > Şu an
    .single();

  if (error) {
    return null;
  }

  return data;
}
