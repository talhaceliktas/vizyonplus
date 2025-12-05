"use server";

import { Table } from "@/types"; // Manuel oluşturduğumuz tipleri çekiyoruz
import supabaseServer from "@lib/supabase/server";

// --- TİP TANIMLAMALARI ---

// 1. Son Yorumlar için Join yapılmış özel tip
// Veritabanından gelen veri yapısı: Yorum + Profil (isim, foto) + İçerik (isim)
interface RecentComment extends Pick<
  Table<"yorumlar">,
  "id" | "yorum" | "olusturulma_zamani"
> {
  profiller: Pick<Table<"profiller">, "isim" | "profil_fotografi"> | null;
  icerikler: Pick<Table<"icerikler">, "isim"> | null;
}

// 2. Fonksiyonun dönüş tipi
export interface DashboardStats {
  counts: {
    users: number;
    content: number;
    comments: number;
    banned: number;
  };
  typeChartData: { name: string; value: number }[];
  genreChartData: { name: string; value: number }[];
  sonKullanicilar: Pick<
    Table<"profiller">,
    "id" | "isim" | "profil_fotografi" | "olusturulma_zamani"
  >[];
  sonYorumlar: RecentComment[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabaseAdmin = await supabaseServer();
  // 1. Temel Sayılar (Parallel Request)
  const [
    { count: toplamKullanici },
    { count: toplamIcerik },
    { count: toplamYorum },
    { count: yasakliKullanici },
  ] = await Promise.all([
    supabaseAdmin.from("profiller").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("icerikler").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("yorumlar").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("profiller")
      .select("*", { count: "exact", head: true })
      .eq("yasakli_mi", true),
  ]);

  // 2. TÜR ANALİZİ
  // Sadece 'turler' kolonunu çekiyoruz. Veritabanından gelen verinin tipini belirtiyoruz.
  const { data: icerikler } = await supabaseAdmin
    .from("icerikler")
    .select("turler");

  // Burada gelen veriyi 'Pick<Icerik, "turler">' dizisi olarak kabul ediyoruz
  const icerikListesi = icerikler as Pick<Table<"icerikler">, "turler">[];

  const turSayaci: Record<string, number> = {};

  icerikListesi?.forEach((row) => {
    if (Array.isArray(row.turler)) {
      row.turler.forEach((tur) => {
        if (tur) {
          turSayaci[tur] = (turSayaci[tur] || 0) + 1;
        }
      });
    }
  });

  const genreChartData = Object.entries(turSayaci)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // 3. Film vs Dizi Dağılımı
  const { data: icerikTipleri } = await supabaseAdmin
    .from("icerikler")
    .select("tur");

  // Gelen veriyi tip güvenli hale getiriyoruz
  const tiplerListesi = icerikTipleri as Pick<Table<"icerikler">, "tur">[];

  // reduce fonksiyonuna jenerik tip (<Record<string, number>>) ekledik.
  // Bu sayede 'acc' değişkeninin ne olduğunu TypeScript anlar.
  const tipDagilimi =
    tiplerListesi?.reduce<Record<string, number>>((acc, curr) => {
      const tip = curr.tur || "Belirsiz";
      acc[tip] = (acc[tip] || 0) + 1;
      return acc;
    }, {}) || {};

  const typeChartData = Object.keys(tipDagilimi).map((key) => ({
    name: key,
    value: tipDagilimi[key],
  }));

  // 4. Son Aktiviteler
  // Son Kullanıcılar: Profil tipinden sadece gerekli alanları alıyoruz
  const { data: sonKullanicilar } = await supabaseAdmin
    .from("profiller")
    .select("id, isim, profil_fotografi, olusturulma_zamani")
    .order("olusturulma_zamani", { ascending: false })
    .limit(5);

  // Son Yorumlar: İlişkisel veriler (Join)
  const { data: sonYorumlar } = await supabaseAdmin
    .from("yorumlar")
    .select(
      `
      id, yorum, olusturulma_zamani,
      profiller (isim, profil_fotografi),
      icerikler (isim)
    `,
    )
    .order("olusturulma_zamani", { ascending: false })
    .limit(5);

  return {
    counts: {
      users: toplamKullanici || 0,
      content: toplamIcerik || 0,
      comments: toplamYorum || 0,
      banned: yasakliKullanici || 0,
    },
    typeChartData,
    genreChartData,
    // Tip dönüşümleri (Casting) ile verinin doğruluğunu garanti ediyoruz
    sonKullanicilar:
      (sonKullanicilar as unknown as DashboardStats["sonKullanicilar"]) || [],
    sonYorumlar: (sonYorumlar as unknown as RecentComment[]) || [],
  };
}
