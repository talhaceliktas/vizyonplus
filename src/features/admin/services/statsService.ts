import supabaseServer from "@lib/supabase/server";

// --- Tipler ---
export interface SubscriptionStats {
  totalActiveSubscribers: number;
  autoRenewalActiveCount: number;
  autoRenewalInactiveCount: number;
  packageDistribution: { name: string; value: number }[];
}

export interface ContentRatingStats {
  contentId: number;
  title: string;
  image: string | null;
  category: string;
  averageScore: number;
  totalVotes: number;
}

export interface EngagementStats {
  totalFavorites: number;
  totalWatchLater: number;
  totalLikes: number;
}

export interface InteractionItem {
  contentId: number;
  title: string;
  image: string | null;
  category: string;
  count: number; // Kaç kere favorilendi/beğenildi sayısı
}

/**
 * Abonelik istatistiklerini getirir ve toplar.
 * Toplam aktif kullanıcı, otomatik yenileme oranları ve paket dağılımını hesaplar.
 */
export const fetchSubscriptionStats = async (): Promise<SubscriptionStats> => {
  const supabase = await supabaseServer();

  // 1. Tüm aktif abonelikleri getir (bitiş tarihi gelecekte olanlar)
  const { data: subs, error } = await supabase
    .from("kullanici_abonelikleri")
    .select("paket_id, otomatik_yenileme, bitis_tarihi")
    .gte("bitis_tarihi", new Date().toISOString());

  if (error || !subs) {
    console.error("Abonelik getirme hatası:", error);
    return {
      totalActiveSubscribers: 0,
      autoRenewalActiveCount: 0,
      autoRenewalInactiveCount: 0,
      packageDistribution: [],
    };
  }

  // 2. Metrikleri hesapla
  const totalActiveSubscribers = subs.length;
  const autoRenewalActiveCount = subs.filter((s) => s.otomatik_yenileme).length;
  const autoRenewalInactiveCount =
    totalActiveSubscribers - autoRenewalActiveCount;

  // 3. Grafikler için Paket ID'sine göre grupla
  const packageMap = subs.reduce((acc: any, curr) => {
    const pkgId = curr.paket_id.toString();
    acc[pkgId] = (acc[pkgId] || 0) + 1;
    return acc;
  }, {});

  const packageDistribution = Object.keys(packageMap).map((key) => ({
    name: `Paket ${key}`,
    value: packageMap[key],
  }));

  return {
    totalActiveSubscribers,
    autoRenewalActiveCount,
    autoRenewalInactiveCount,
    packageDistribution,
  };
};

/**
 * Ortalama puana göre en iyi içerikleri getirir.
 * Formül: toplam_puan / toplam_kullanici
 */
export const fetchTopRatedContent = async (
  limit = 5,
): Promise<ContentRatingStats[]> => {
  const supabase = await supabaseServer();

  // 1. İçerik detaylarıyla birleştirilmiş istatistikleri çek
  const { data, error } = await supabase
    .from("icerik_puan_istatistikleri")
    .select(
      `
      icerik_id,
      toplam_puan,
      toplam_kullanici,
      icerikler ( isim, fotograf, tur ) 
    `,
    )
    .order("toplam_puan", { ascending: false })
    .limit(20);

  if (error || !data) {
    console.error("Puanlama getirme hatası:", error);
    return [];
  }

  // 2. Formatla ve Ortalamaları Hesapla
  const formattedStats = data.map((item: any) => ({
    contentId: item.icerik_id,
    title: item.icerikler?.isim || "Bilinmeyen İçerik",
    image: item.icerikler?.fotograf || null,
    category: item.icerikler?.tur || "Genel",
    averageScore:
      item.toplam_kullanici > 0
        ? Number((item.toplam_puan / item.toplam_kullanici).toFixed(1))
        : 0,
    totalVotes: item.toplam_kullanici,
  }));

  // 3. Ortalama puana göre sırala ve limiti uygula
  return formattedStats
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, limit);
};

export const fetchEngagementStats = async (): Promise<EngagementStats> => {
  const supabase = await supabaseServer();

  // Paralel olarak sayıları çekiyoruz (count: 'exact')
  const [favorites, watchLater, likes] = await Promise.all([
    supabase.from("favoriler").select("*", { count: "exact", head: true }),
    supabase
      .from("daha_sonra_izle")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("begeniler")
      .select("*", { count: "exact", head: true })
      .eq("durum", true), // Sadece 'Like' olanlar
  ]);

  return {
    totalFavorites: favorites.count || 0,
    totalWatchLater: watchLater.count || 0,
    totalLikes: likes.count || 0,
  };
};

/**
 * Belirtilen tabloya göre "En Çok Etkileşim Alan" içerikleri getirir.
 * type: 'favoriler' | 'daha_sonra_izle' | 'begeniler'
 */
export const fetchTopInteractions = async (
  tableName: "favoriler" | "daha_sonra_izle" | "begeniler",
  limit = 5,
): Promise<InteractionItem[]> => {
  const supabase = await supabaseServer();

  // Tabloya göre ilişki sütunu adı değişiyor
  const foreignKey = tableName === "begeniler" ? "icerik_id" : "icerikler_id";

  // Not: Büyük verilerde bu işlem için RPC (SQL Function) yazmak daha performanslıdır.
  // Şimdilik JS tarafında gruplama yapıyoruz.
  let query = supabase
    .from(tableName)
    .select(`${foreignKey}, icerikler ( isim, fotograf, tur )`);

  // Eğer tablomuz 'begeniler' ise sadece like (true) olanları al
  if (tableName === "begeniler") {
    query = query.eq("durum", true);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error(`${tableName} getirme hatası:`, error);
    return [];
  }

  // Veriyi grupla ve say (Group By & Count)
  const countMap = data.reduce((acc: any, curr: any) => {
    // Tip güvenliği için cast işlemi
    const content = curr.icerikler as {
      isim: string;
      fotograf: string;
      tur: string;
    } | null;
    const id = curr[foreignKey];

    if (!acc[id] && content) {
      acc[id] = {
        contentId: id,
        title: content.isim,
        image: content.fotograf,
        category: content.tur,
        count: 0,
      };
    }
    if (acc[id]) {
      acc[id].count += 1;
    }
    return acc;
  }, {});

  // Objeyi diziye çevir, sırala ve limiti uygula
  return (
    Object.values(countMap)
      // @ts-ignore (InteractionItem tipine uygun olduğunu biliyoruz)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, limit) as InteractionItem[]
  );
};
