import supabaseClient from "@/lib/supabase/client";

export const kullanicilariCekAdmin = async (page: number, limit: number) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseClient
    .from("profiller")
    .select("*", { count: "exact" })
    .order("olusturulma_zamani", { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
    return { data: [], count: 0, durum: "basarisiz" };
  }
  return { data, count, durum: "basarili" };
};

export const kullaniciIsimGuncelle = async (id: string, yeniIsim: string) => {
  const { error } = await supabaseClient
    .from("profiller")
    .update({ isim: yeniIsim })
    .eq("id", id);

  if (error) return { durum: "basarisiz", hata: error.message };
  return { durum: "basarili" };
};

export const kullaniciBanDurumuDegistir = async (
  id: string,
  suankiDurum: boolean,
) => {
  const { error } = await supabaseClient
    .from("profiller")
    .update({ yasakli_mi: !suankiDurum })
    .eq("id", id);

  if (error) return { durum: "basarisiz", hata: error.message };
  return { durum: "basarili" };
};
