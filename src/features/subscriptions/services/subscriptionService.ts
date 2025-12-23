/**
 * Bu dosya, abonelik verilerini çekmek için kullanılan servis fonksiyonlarını içerir.
 * Sunucu bileşenleri (Server Components) tarafından veri çekmek (fetching) için kullanılır.
 */

import supabaseServer from "@/lib/supabase/server";
import { AbonelikPaketi } from "@/types";

/**
 * Veritabanındaki tüm aktif abonelik paketlerini çeker.
 * Fiyata göre artan sırada (ucuzdan pahalıya) listeler.
 */
export async function getSubscriptionPlans() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("abonelik_paketleri")
    .select("*")
    .eq("aktif_mi", true) // Sadece aktif paketleri getir
    .order("fiyat", { ascending: true }); // Sıralama: Ucuz -> Pahalı

  if (error) {
    console.error("Paketler çekilemedi:", error.message);
    return [];
  }

  return data as AbonelikPaketi[];
}

export interface UserSubscription {
  id: string;
  baslangic_tarihi: string;
  bitis_tarihi: string;
  otomatik_yenileme: boolean;
  paket: AbonelikPaketi; // İlişkili paket bilgisi
}

/**
 * Belirli bir kullanıcının mevcut (aktif) aboneliğini çeker.
 * Eğer kullanıcının aktif bir aboneliği yoksa null döner.
 */
export async function getCurrentUserSubscription(
  userId: string,
): Promise<UserSubscription | null> {
  const supabase = await supabaseServer();

  // Supabase sorgusu: kullanici_abonelikleri tablosundan, abonelik_paketleri ilişkisiyle veri çek
  const { data, error } = await supabase
    .from("kullanici_abonelikleri")
    .select(
      `
      id,
      baslangic_tarihi,
      bitis_tarihi,
      otomatik_yenileme,
      paket:abonelik_paketleri (
        id,
        paket_adi,
        fiyat,
        ozellikler
      )
    `,
    )
    .eq("kullanici_id", userId)
    .gte("bitis_tarihi", new Date().toISOString()) // Sadece süresi dolmamış (gelecekte biten) kayıtları getir
    .order("bitis_tarihi", { ascending: false }) // Birden fazla varsa en uzun süreliyi al
    .limit(1) // Tek kayıt al
    .maybeSingle(); // Veri yoksa hata vermez, null döner

  if (error) {
    console.error("Abonelik sorgulama hatası:", error.message);
    return null;
  }

  // Paket bilgisi gelmediyse veya abonelik yoksa null dön
  if (!data || !data.paket) return null;

  // Supabase'den gelen ham veriyi uygulamanın `UserSubscription` tipine dönüştür
  return {
    id: data.id,
    baslangic_tarihi: data.baslangic_tarihi,
    bitis_tarihi: data.bitis_tarihi,
    otomatik_yenileme: data.otomatik_yenileme,
    paket: data.paket as unknown as AbonelikPaketi, // Tip güvenliği için cast işlemi
  };
}

/**
 * ID'ye göre tek bir abonelik paketinin detaylarını çeker.
 * Ödeme sayfası vb. yerlerde paketi doğrulamak için kullanılır.
 */
export async function getSubscriptionPlanById(id: number) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("abonelik_paketleri")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as AbonelikPaketi;
}
