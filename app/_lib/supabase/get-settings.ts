"use server";

import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export interface SiteSettings {
  duyuru_aktif: boolean;
  duyuru_metni: string;
  duyuru_tipi: string;
  bakim_modu: boolean;
  yeni_uye_alimi: boolean;
  yorumlar_kilitli: boolean;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const getCachedSettings = unstable_cache(
  async () => {
    const { data, error } = await supabase.from("ayarlar").select("*").single();

    if (error) {
      console.error("Ayar çekme hatası:", error);
      return null;
    }
    return data as SiteSettings;
  },
  ["site-settings-key"],
  { tags: ["site-settings"] },
);
