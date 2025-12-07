"use server";

import supabaseServer from "@/lib/supabase/server";
import supabaseAdmin from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createMockSubscription(paketId: number) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Kullanıcı oturumu bulunamadı." };
  }

  // 2. Paket bilgisini çek (Bunu normal client ile yapabilirsin, okuma izni var)
  const { data: paket } = await supabase
    .from("abonelik_paketleri")
    .select("sure_gun, paket_adi")
    .eq("id", paketId)
    .single();

  if (!paket) {
    return { success: false, error: "Geçersiz paket." };
  }

  // 3. Hesaplamalar
  const baslangic = new Date();
  const bitis = new Date();
  bitis.setDate(baslangic.getDate() + paket.sure_gun);

  // 4. KAYIT İŞLEMİ (Burada supabaseAdmin kullanıyoruz!)
  // supabaseAdmin, RLS kurallarını bypass eder (Süper Yetki).
  // Kullanıcı ID'sini güvendiğimiz 'user.id' değişkeninden alıyoruz.
  const { error } = await supabaseAdmin.from("kullanici_abonelikleri").insert({
    kullanici_id: user.id, // Kullanıcı kendini doğruladı, bu ID güvenli
    paket_id: paketId, // Bizim kodumuzdan gelen ID
    baslangic_tarihi: baslangic.toISOString(),
    bitis_tarihi: bitis.toISOString(),
    otomatik_yenileme: true,
    provider_abonelik_id: `mock_${Date.now()}`,
  });

  if (error) {
    console.error("Db hatası:", error);
    return { success: false, error: "Abonelik oluşturulamadı." };
  }

  revalidatePath("/profil");
  revalidatePath("/abonelikler");
  revalidatePath("/izle");

  return { success: true };
}
