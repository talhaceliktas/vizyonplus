import supabaseServer from "@/lib/supabase/server";
import { AbonelikPaketi } from "@/types";

export async function getSubscriptionPlans() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("abonelik_paketleri") // Tablo adın CSV'den anladığım kadarıyla bu olmalı
    .select("*")
    .eq("aktif_mi", true)
    .order("fiyat", { ascending: true }); // Ucuzdan pahalıya

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
  paket: AbonelikPaketi;
}

export async function getCurrentUserSubscription(
  userId: string,
): Promise<UserSubscription | null> {
  const supabase = await supabaseServer();

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
    .gte("bitis_tarihi", new Date().toISOString()) // Sadece süresi dolmamışları getir
    .order("bitis_tarihi", { ascending: false }) // En uzun süreliyi en başa al
    .limit(1) // Sadece 1 tane getir
    .maybeSingle();

  if (error) {
    console.error("Abonelik sorgulama hatası:", error.message);
    return null;
  }

  // Paket bilgisi gelmediyse veya abonelik yoksa null dön
  if (!data || !data.paket) return null;

  // Supabase'den gelen veriyi bizim tipimize uyduruyoruz (Mapping)
  return {
    id: data.id,
    baslangic_tarihi: data.baslangic_tarihi,
    bitis_tarihi: data.bitis_tarihi,
    otomatik_yenileme: data.otomatik_yenileme,
    paket: data.paket as unknown as AbonelikPaketi, // Tip zorlaması (Supabase tipleri bazen array dönebilir)
  };
}

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
