"use server";
import supabaseServer from "@lib/supabase/server";
import { supabaseStatic } from "@lib/supabase/server-static";
import { FeaturedContent } from "../types";
import { Table } from "@/types";

export async function getFeaturedContent(): Promise<FeaturedContent[]> {
  const supabase = await supabaseStatic();
  const { data, error } = await supabase
    .from("tanitimlar")
    .select("icerikler(*)");
  if (error || !data) return [];

  return data
    .map(mapToFeaturedContent)
    .filter((item): item is FeaturedContent => item !== null);
}

export async function getContents(
  tur: string,
  turFiltresi?: string,
  limit = 10,
) {
  const supabase = await supabaseStatic();

  const selectQuery =
    tur === "film"
      ? "isim, fotograf, tur, turler, id, film_ucretleri(satin_alma_ucreti, indirim_orani, ogrenci_indirim_orani)"
      : "isim, fotograf, tur, turler, id, dizi(sezon_numarasi)";

  let query = supabase.from("icerikler").select(selectQuery).eq("tur", tur);

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

export async function getFilteredContents(
  tur: string | null,
  kategori: string | null,
  sirala: string | null,
  page: number = 1,
) {
  const supabase = await supabaseStatic();

  const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_CONTENT_PAGE_SIZE!);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase.from("icerikler").select("*", { count: "exact" });

  if (tur && tur !== "hepsi") {
    query = query.eq("tur", tur);
  }

  if (kategori) {
    query = query.contains("turler", [kategori]);
  }

  switch (sirala) {
    case "eski":
      query = query.order("yayinlanma_tarihi", { ascending: true });
      break;
    case "a-z":
      query = query.order("isim", { ascending: true });
      break;
    case "yeni":
    default:
      query = query.order("yayinlanma_tarihi", { ascending: false });
      break;
  }

  query = query.range(from, to);

  const { data: icerikler, error, count } = await query;

  if (error) {
    return { data: [], count: 0 };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const safeData = icerikler.map((i) => ({ ...i, isSaved: false }));
      return { data: safeData, count: count || 0 };
    }

    const icerikIdleri = icerikler.map((i) => i.id);
    const { data: kayitliOlanlar } = await supabase
      .from("daha_sonra_izle")
      .select("icerikler_id")
      .eq("kullanici_id", user.id)
      .in("icerikler_id", icerikIdleri);

    const kayitliIdSeti = new Set(kayitliOlanlar?.map((k) => k.icerikler_id));

    const mergedData = icerikler.map((icerik) => ({
      ...icerik,
      isSaved: kayitliIdSeti.has(icerik.id),
    }));

    return { data: mergedData, count: count || 0 };
  } catch (err) {
    return {
      data: icerikler.map((i) => ({ ...i, isSaved: false })),
      count: count || 0,
    };
  }
}

export async function getContentBySlug(slug: string) {
  const supabase = await supabaseStatic();

  const { data, error } = await supabase
    .from("icerikler")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Table<"icerikler">;
}

export async function getUserContentInteractions(
  userId: string,
  contentId: number,
  icerikTur: string,
) {
  const supabase = await supabaseServer();

  let watchHistoryQuery;

  if (icerikTur === "dizi") {
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
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
  } else {
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

  const [subscription, rating, watchHistory, voteStatus, favorite, watchLater] =
    await Promise.all([
      supabase
        .from("kullanici_abonelikleri")
        .select("*")
        .eq("kullanici_id", userId)
        .gte("bitis_tarihi", new Date().toISOString())
        .maybeSingle(),

      supabase
        .from("icerik_puanlari")
        .select("puan")
        .eq("kullanici_id", userId)
        .eq("icerik_id", contentId)
        .maybeSingle(),

      watchHistoryQuery,

      supabase
        .from("begeniler")
        .select("durum")
        .eq("kullanici_id", userId)
        .eq("icerik_id", contentId)
        .maybeSingle(),

      supabase
        .from("favoriler")
        .select("icerikler_id")
        .eq("kullanici_id", userId)
        .eq("icerikler_id", contentId)
        .maybeSingle(),

      supabase
        .from("daha_sonra_izle")
        .select("icerikler_id")
        .eq("kullanici_id", userId)
        .eq("icerikler_id", contentId)
        .maybeSingle(),
    ]);

  return {
    isSubscribed: !!subscription.data,
    userRating: rating.data?.puan || null,
    watchHistory: (watchHistory.data as any) || null,
    voteStatus: voteStatus.data?.durum ?? null,
    favorite: !!favorite.data,
    watchLater: !!watchLater.data,
  };
}

export async function getContentAverageRating(contentId: number) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc("get_rating_stats", {
    _icerik_id: contentId,
  });

  if (error) {
    console.error("Puan hesaplama hatası:", error.message);
    return { average: 0, count: 0 };
  }

  return {
    average: Number(data.average),
    count: Number(data.count),
  };
}

function mapToFeaturedContent(raw: any): FeaturedContent | null {
  const icerik = raw.icerikler;
  if (!icerik) return null;

  return {
    id: icerik.id,
    isim: icerik.isim,
    aciklama: icerik.aciklama || "Açıklama mevcut değil.",
    kategoriler: (icerik.turler || []).slice(0, 3).join(" | "),
    sure: `${icerik.sure || 0} dk`,
    tur: icerik.tur,
    poster: icerik.yan_fotograf || icerik.fotograf,
    link: `/icerikler/${icerik.tur === "film" ? "filmler" : "diziler"}/${icerik.id}`,
    slug: icerik.slug,
  };
}

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
