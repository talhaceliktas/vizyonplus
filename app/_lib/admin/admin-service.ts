import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function getDashboardStats() {
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

  // 2. TÜR ANALİZİ (ARRAY FLATTENING)
  const { data: icerikler } = await supabaseAdmin
    .from("icerikler")
    .select("turler");

  // Türleri saymak için bir harita (map) oluşturuyoruz
  const turSayaci: Record<string, number> = {};

  icerikler?.forEach((row) => {
    // row.turler'in bir dizi olduğunu ve boş olmadığını kontrol et
    if (Array.isArray(row.turler)) {
      row.turler.forEach((tur: string) => {
        // Eğer tur ismi varsa sayacı artır
        if (tur) {
          turSayaci[tur] = (turSayaci[tur] || 0) + 1;
        }
      });
    }
  });

  // Map'i grafik formatına çevir ve en çoktan aza sırala (Top 10)
  const genreChartData = Object.entries(turSayaci)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Sadece en popüler 10 türü alalım

  // 3. Film vs Dizi Dağılımı (Mevcut Pasta Grafik için)
  const { data: icerikTipleri } = await supabaseAdmin
    .from("icerikler")
    .select("tur"); // Burada 'tur' kolonu 'Film' veya 'Dizi' tutuyor sanırım, yoksa mantığı değiştiririz.

  const tipDagilimi = icerikTipleri?.reduce((acc, curr) => {
    const tip = curr.tur || "Belirsiz";
    acc[tip] = (acc[tip] || 0) + 1;
    return acc;
  }, {});

  const typeChartData = Object.keys(tipDagilimi || {}).map((key) => ({
    name: key,
    value: tipDagilimi[key],
  }));

  // 4. Son Aktiviteler (Aynı kalıyor)
  const { data: sonKullanicilar } = await supabaseAdmin
    .from("profiller")
    .select("id, isim, profil_fotografi, olusturulma_zamani")
    .order("olusturulma_zamani", { ascending: false })
    .limit(5);

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
    typeChartData, // Pasta grafik için (Film/Dizi)
    genreChartData, // YENİ: Bar grafik için (Aksiyon, Dram vs.)
    sonKullanicilar,
    sonYorumlar,
  };
}
