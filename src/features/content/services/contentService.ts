"use server";
import supabaseServer from "@lib/supabase/server";
import { FeaturedContent } from "../types";

export async function getFeaturedContent(): Promise<FeaturedContent[]> {
  const supabase = await supabaseServer();

  const { data: tanitimlar, error } = await supabase
    .from("tanitimlar")
    .select("icerikler(*)");

  if (error || !tanitimlar) {
    console.error("Tanıtım hatası:", error?.message);
    return [];
  }

  const slidesData = tanitimlar
    .map((tanitim) => {
      const icerik: any = tanitim.icerikler;
      if (!icerik) return null;

      const mappedItem: FeaturedContent = {
        id: icerik.id,
        isim: icerik.isim,
        aciklama: icerik.aciklama || "Açıklama mevcut değil.",
        kategoriler: (icerik.turler || []).slice(0, 3).join(" | "),
        sure: `${icerik.sure || 0} dk`,
        tur: icerik.tur,
        poster: icerik.yan_fotograf || icerik.fotograf,
        link: `/icerikler/${icerik.tur === "film" ? "filmler" : "diziler"}/${icerik.id}`,
      };

      return mappedItem;
    })
    .filter((item): item is FeaturedContent => item !== null);

  return slidesData;
}

export async function getContents(tur: string, turFiltresi?: string) {
  const supabase = await supabaseServer();

  const selectQuery =
    tur === "film"
      ? "isim, fotograf, tur, turler, id, film_ucretleri(satin_alma_ucreti, indirim_orani, ogrenci_indirim_orani)"
      : "isim, fotograf, tur, turler, id, dizi(sezon_numarasi)";

  let query = supabase.from("icerikler").select(selectQuery).eq("tur", tur);

  if (turFiltresi) {
    query = query.contains("turler", [turFiltresi]);
  }

  const { data: icerikler, error } = await query;

  if (error) {
    console.log(error);
    return [];
  }

  return icerikler as any;
}

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_CONTENT_PAGE_SIZE!);

export async function getFilteredContents(
  tur: string | null,
  kategori: string | null,
  sirala: string | null,
  page: number = 1,
) {
  const supabase = await supabaseServer();

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
