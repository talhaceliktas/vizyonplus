"use server";

/**
 * Bu dosya, site genel ayarlarını veritabanından çeken servis fonksiyonunu içerir.
 * Performans için `unstable_cache` kullanarak verileri önbelleğe alır.
 */

import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { Table } from "../../../types";

const defaultSettings: Table<"ayarlar"> = {
  id: 1,
  duyuru_aktif: false,
  duyuru_metni: "",
  duyuru_tipi: "",
  bakim_modu: false,
  yeni_uye_alimi: true,
  yorumlar_kilitli: false,
};

// Bu servis, sunucu eylemlerinden bağımsız olarak, önbelleklenmiş veri çektiği için
// doğrudan createClient kullanabilir (Anonim okuma yetkisi varsa).
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

/**
 * Site ayarlarını önbellekten (yoksa veritabanından) getirir.
 * Cache Tag: 'site-settings' (Yönetici panelinden bu tag invalidate edilerek önbellek temizlenir)
 */
export const getCachedSettings = unstable_cache(
  async () => {
    const { data, error } = await supabase.from("ayarlar").select("*").single();

    if (error) {
      console.error("Ayar çekme hatası:", error);
      return defaultSettings;
    }
    return data as Table<"ayarlar">;
  },
  ["site-settings-key"],
  { tags: ["site-settings"] },
);
