"use server";
import supabaseServer from "@lib/supabase/server";
import { supabaseStatic } from "@lib/supabase/server-static";
import { FeaturedContent } from "../types";
import { Table } from "@/types";

// BU DOSYA NE İŞE YARAR?
// İçeriklerle (Film ve Dizi) ilgili verilerin çekildiği ana servistir.
// Veritabanı sorguları (SQL benzeri Supabase query'leri) burada yazılır.
// "use server" olduğu için tüm fonksiyonlar sunucu tarafında çalışır.

// ÖNE ÇIKAN İÇERİKLERİ GETİR
// Ana sayfadaki büyük slider için kullanılır.
export async function getFeaturedContent(): Promise<FeaturedContent[]> {
  // StaticClient kullanımı: Bu sayfa sık değişmediği için statik oluşturulabilir.
  const supabase = await supabaseStatic();

  // "tanitimlar" tablosundan veriyi ve ilişkili "icerikler" detayını çek.
  // select("icerikler(*)") ilişkili tablodaki tüm sütunları getirir (JOIN işlemi).
  const { data, error } = await supabase
    .from("tanitimlar")
    .select("icerikler(*)");

  if (error || !data) return [];

  // Gelen ham veriyi uygulamanın kullanacağı formata çevir (Mapping).
  return data
    .map(mapToFeaturedContent)
    .filter((item): item is FeaturedContent => item !== null);
}

// FİLTRELİ İÇERİK GETİR
// Kategori sayfası, arama sonuçları vb. için kullanılır.
export async function getContents(
  tur: string,
  turFiltresi?: string,
  limit = 10,
) {
  const supabase = await supabaseStatic();

  // Performans için sadece gerekli sütunları seç (SELECT).
  const selectQuery =
    tur === "film"
      ? "isim, fotograf, tur, turler, id, slug, film_ucretleri(satin_alma_ucreti, indirim_orani, ogrenci_indirim_orani)"
      : "isim, fotograf, tur, turler, id, slug, dizi(sezon_numarasi)";

  // Temel sorgu: "icerikler" tablosundan "tur" sütunu eşleşenleri getir.
  let query = supabase.from("icerikler").select(selectQuery).eq("tur", tur);

  // Kategori Filtresi (Örn: Aksiyon, Dram)
  // "turler" sütunu bir array (dizi) olduğu için, array içinde arama yapılır.
  if (turFiltresi) {
    query = query.contains("turler", [turFiltresi]);
  }

  const { data: icerikler, error } = await query.limit(limit);

  if (error) {
    console.log(error);
    return [];
  }

  return icerikler as any;
}

// GELİŞMİŞ FİLTRELEME VE SAYFALAMA
// Tüm içerikler sayfasında (katalog) kullanılır.
export async function getFilteredContents(
  tur: string | null,
  kategori: string[] | null,
  sirala: string | null,
  page: number = 1,
) {
  const supabase = await supabaseServer();
  let filtrelenmisKategori = kategori;

  // SAYFALAMA (PAGINATION) MANTIĞI
  // Kaçıncı satırdan kaçıncı satıra kadar veri çekileceğini hesaplar.
  const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_CONTENT_PAGE_SIZE!);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("icerikler")
    .select("*, icerik_puan_istatistikleri(*)", {
      count: "exact", // Toplam kayıt sayısını da döndür
    });

  // Tür Filtresi Logic
  if (tur === "onerilenler") {
    // Kişiye özel öneri yapay zeka/algoritma kısmı
    filtrelenmisKategori = await kullaniciOnerilenTurlerOlustur();
  } else if (tur && tur !== "hepsi") {
    query = query.eq("tur", tur);
  }

  // Kategori Filtresi (Çoklu seçim olabilir: Aksiyon VE Macera)
  if (filtrelenmisKategori && filtrelenmisKategori.length > 0) {
    if (kategori !== filtrelenmisKategori) {
      // Önerilenlerde "overlaps" kullanılır (Herhangi biri eşleşse yeter)
      query = query.overlaps("turler", filtrelenmisKategori);
    } else {
      // Normal filtrede "contains" kullanılır (Hepsi olmalı)
      query = query.contains("turler", filtrelenmisKategori);
    }
  }

  // SIRALAMA (ORDER BY)
  switch (sirala) {
    case "eski":
      query = query.order("yayinlanma_tarihi", { ascending: true }); // Eskiden yeniye
      break;
    case "a-z":
      query = query.order("isim", { ascending: true }); // Alfabetik
      break;
    case "z-a":
      query = query.order("isim", { ascending: false }); // Ters Alfabetik
      break;
    case "ortalama_puan_azalan":
      query = query.order("ortalama_puan", { ascending: false }); // Yüksek puanlıdan düşüğe
      break;
    case "ortalama_puan_artan":
      query = query.order("ortalama_puan", { ascending: true });
      break;
    case "yeni":
    default:
      query = query.order("yayinlanma_tarihi", { ascending: false }); // En yeniler
      break;
  }

  // Sayfalama uygula
  query = query.range(from, to);

  const { data: icerikler, error, count } = await query;

  if (error) {
    console.error("İçerik getirme hatası:", error);
    return { data: [], count: 0 };
  }

  // KULLANICI ETKİLEŞİM KONTROLÜ
  // (Listelenen içerik kullanıcı tarafından "Daha Sonra İzle"ye eklenmiş mi?)
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Kullanıcı yoksa direkt veriyi dön
    if (!user) {
      const safeData = icerikler.map((i) => ({ ...i, isSaved: false }));
      return { data: safeData, count: count || 0 };
    }

    // Kullanıcı giriş yapmışsa:
    // Bu sayfadaki içerik ID'lerini topla
    const icerikIdleri = icerikler.map((i) => i.id);

    // Veritabanından kullanıcının kaydettiklerini sor
    const { data: kayitliOlanlar } = await supabase
      .from("daha_sonra_izle")
      .select("icerikler_id")
      .eq("kullanici_id", user.id)
      .in("icerikler_id", icerikIdleri); // Sadece ekrandaki ID'leri sor (Optimisation)

    // Hızlı arama için Set yapısı kullan (O(1) lookup)
    const kayitliIdSeti = new Set(kayitliOlanlar?.map((k) => k.icerikler_id));

    // Her içeriğe "isSaved" bilgisini ekle
    const mergedData = icerikler.map((icerik) => ({
      ...icerik,
      isSaved: kayitliIdSeti.has(icerik.id),
    }));

    return {
      data:
        kategori !== filtrelenmisKategori
          ? mergedData.slice(0, 12)
          : mergedData,
      count: kategori !== filtrelenmisKategori ? 12 : count || 0,
    };
  } catch (err) {
    // Hata durumunda (örn: auth servisi kapalı) yine de içeriği göster, isSaved false olsun.
    return {
      data:
        kategori !== filtrelenmisKategori
          ? icerikler.map((i) => ({ ...i, isSaved: false })).slice(0, 12)
          : icerikler.map((i) => ({ ...i, isSaved: false })),
      count: kategori !== filtrelenmisKategori ? 12 : count || 0,
    };
  }
}

// KULLANICIYA ÖZEL ÖNERİ OLUŞTURUCU
// Kullanıcının en son beğendiği 3 içeriği baz alarak tür önerisi yapar.
export async function kullaniciOnerilenTurlerOlustur() {
  const supabase = await supabaseServer();

  // 1. Kullanıcı Kontrolü
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // 2. Son Beğenilen 3 İçeriğin ID'sini Çek
  const { data: begeniler, error: begeniHatasi } = await supabase
    .from("begeniler")
    .select("icerik_id")
    .eq("kullanici_id", user.id)
    .eq("durum", true)
    .order("guncellenme_zamani", { ascending: false })
    .limit(3);

  if (begeniHatasi || !begeniler?.length) return [];

  const icerikIdleri = begeniler.map((b) => b.icerik_id);

  // 3. Bu ID'lere Ait Türleri Çek (Örn: Dram, Suç)
  const { data: icerikler, error: icerikHatasi } = await supabase
    .from("icerikler")
    .select("turler")
    .in("id", icerikIdleri);

  if (icerikHatasi || !icerikler) return [];

  // 4. Türleri Birleştir ve Benzersiz Yap (Unique)
  // flatMap: İç içe arrayleri düzleştirir.
  // Set: Kopyaları temizler.
  const benzersizTurler = [...new Set(icerikler.flatMap((i) => i.turler))];

  return benzersizTurler;
}

// SLUG İLE TEKİL İÇERİK GETİR
export async function getContentBySlug(slug: string) {
  const supabase = await supabaseStatic();

  const { data, error } = await supabase
    .from("icerikler")
    .select("*")
    .eq("slug", slug)
    .single(); // .single(): Sadece tek bir satır dönmesini bekler, yoksa hata verir.

  if (error) return null;
  return data as Table<"icerikler">;
}

// KULLANICI İÇERİK ETKİLEŞİMLERİNİ GETİR
// Kullanıcı bu içeriği beğenmiş mi? Puan vermiş mi? Nerede kalmış? vs.
export async function getUserContentInteractions(
  userId: string,
  contentId: number,
  icerikTur: string,
) {
  const supabase = await supabaseServer();

  let watchHistoryQuery;

  // İzleme geçmişi sorgusu (Dizi mi Film mi?)
  if (icerikTur === "dizi") {
    // Dizilerde bölüm bazlı takip vardır.
    // En son izlenen bölümü bul.
    watchHistoryQuery = supabase
      .from("izleme_gecmisi")
      .select(
        `
        kalinan_saniye,
        toplam_saniye,
        updated_at,
        bolumler!inner (
          id,
          sezon_numarasi,
          bolum_numarasi
        )
      `,
      )
      .eq("kullanici_id", userId)
      .eq("bolumler.icerik_id", contentId)
      .order("updated_at", { ascending: false }) // En son izlenen en üstte
      .limit(1)
      .maybeSingle(); // maybeSingle: Sonuç yoksa null döner, hata atmaz.
  } else {
    // Film geçmişi daha basittir.
    watchHistoryQuery = supabase
      .from("izleme_gecmisi")
      .select(
        `
        kalinan_saniye,
        toplam_saniye,
        updated_at
      `,
      )
      .eq("kullanici_id", userId)
      .eq("film_id", contentId)
      .maybeSingle();
  }

  // Promise.all: Tüm sorguları AYNI ANDA başlat ve hepsinin bitmesini bekle.
  // Bu yöntem sıralı (await await) yapmaktan çok daha hızlıdır.
  const [subscription, rating, watchHistory, voteStatus, favorite, watchLater] =
    await Promise.all([
      // 1. Abonelik Var mı?
      supabase
        .from("kullanici_abonelikleri")
        .select("*")
        .eq("kullanici_id", userId)
        .gte("bitis_tarihi", new Date().toISOString()) // Tarihi geçmemiş olmalı
        .maybeSingle(),

      // 2. Puan Vermiş mi?
      supabase
        .from("icerik_puanlari")
        .select("puan")
        .eq("kullanici_id", userId)
        .eq("icerik_id", contentId)
        .maybeSingle(),

      // 3. İzleme Geçmişi (Yukarıda hazırlanan sorgu)
      watchHistoryQuery,

      // 4. Beğeni Durumu (Like/Dislike)
      supabase
        .from("begeniler")
        .select("durum")
        .eq("kullanici_id", userId)
        .eq("icerik_id", contentId)
        .maybeSingle(),

      // 5. Favorilere Eklemiş mi?
      supabase
        .from("favoriler")
        .select("icerikler_id")
        .eq("kullanici_id", userId)
        .eq("icerikler_id", contentId)
        .maybeSingle(),

      // 6. Daha Sonra İzleye Eklemiş mi?
      supabase
        .from("daha_sonra_izle")
        .select("icerikler_id")
        .eq("kullanici_id", userId)
        .eq("icerikler_id", contentId)
        .maybeSingle(),
    ]);

  return {
    isSubscribed: !!subscription.data, // !! ile boolean'a çeviriyoruz (varsa true, null'sa false)
    userRating: rating.data?.puan || null,
    watchHistory: (watchHistory.data as any) || null,
    voteStatus: voteStatus.data?.durum ?? null,
    favorite: !!favorite.data,
    watchLater: !!watchLater.data,
  };
}

// İÇERİK ORTALAMA PUANI
export async function getContentAverageRating(contentId: number) {
  const supabase = await supabaseServer();

  // "view" veya tetikleyici ile tutulan istatistik tablosundan çekiyoruz.
  const { data, error } = await supabase
    .from("icerik_puan_istatistikleri")
    .select("*")
    .eq("icerik_id", contentId)
    .single();

  if (error) {
    return { average: 0, count: 0 };
  }

  return {
    average: Number(data.toplam_puan / data.toplam_kullanici),
    count: Number(data.toplam_kullanici),
  };
}

// YARDIMCI (HELPER) FONKSİYON
// Veritabanı objesini frontend'in beklediği tipe dönüştürür.
function mapToFeaturedContent(raw: any): FeaturedContent | null {
  const icerik = raw.icerikler;
  if (!icerik) return null;

  return {
    id: icerik.id,
    isim: icerik.isim,
    aciklama: icerik.aciklama || "Açıklama mevcut değil.",
    kategoriler: (icerik.turler || []).slice(0, 3).join(" | "), // İlk 3 türü aralarına | koyarak birleştir
    sure: `${icerik.sure || 0} dk`,
    tur: icerik.tur,
    poster: icerik.yan_fotograf || icerik.fotograf, // Varsa yan, yoksa dik foto
    link: `/icerikler/${icerik.tur === "film" ? "filmler" : "diziler"}/${icerik.id}`,
    slug: icerik.slug,
  };
}

// BÖLÜMLERİ GETİR
export async function getContentEpisodes(contentId: number) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("bolumler")
    .select("*")
    .eq("icerik_id", contentId)
    .order("sezon_numarasi", { ascending: true })
    .order("bolum_numarasi", { ascending: true });

  if (error) {
    console.error("Bölüm getirme hatası:", error.message);
    return [];
  }

  return data;
}
