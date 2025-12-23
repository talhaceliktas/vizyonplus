/**
 * Bu dosya, istemci tarafında (browser) arama işlemi yapmak için kullanılan servisir.
 * Supabase istemcisini (`supabaseClient`) kullanarak veritabanından sorgulama yapar.
 */

import supabaseClient from "@lib/supabase/client";

/**
 * İçerikler tablosunda isme göre arama yapar.
 * @param arama - Aranan kelime
 * @param signal - İsteği iptal etmek için AbortSignal (yeni arama başladığında eskisi iptal edilir)
 * @returns İlk 6 eşleşen içerik
 */
export async function searchContent(arama: string, signal: AbortSignal) {
  const { data: icerikler, error } = await supabaseClient
    .from("icerikler")
    .select("id, isim, fotograf, tur, aciklama, slug")
    .ilike("isim", `%${arama}%`) // Case-insensitive (büyük/küçük harf duyarsız) kısmi eşleşme
    .abortSignal(signal) // İptal sinyalini bağla
    .limit(6); // Maksimum 6 sonuç getir

  return icerikler;
}
