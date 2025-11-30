"use server";

import supabaseServer from "./supabase/server";

export async function icerikleriGetir(tur: string, turFiltresi?: string) {
  const supabase = await supabaseServer();

  const selectQuery =
    tur === "film"
      ? "isim, fotograf, tur, turler, id, film_ucretleri(satin_alma_ucreti, indirim_orani, ogrenci_indirim_orani)"
      : "isim, fotograf, tur, turler, id, dizi(sezon_numarasi)";

  // Temel sorguyu bir değişkene atıyoruz. .eq("tur", tur) filtresi her zaman uygulanacak.
  let query = supabase.from("icerikler").select(selectQuery).eq("tur", tur);

  if (turFiltresi) {
    query = query.contains("turler", [turFiltresi]);
  }

  const { data: icerikler, error } = await query;

  if (error) {
    // not-found sayfasi eklenecek
    console.log(error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return icerikler as any;
}

export async function filmiGetir(filmId: number) {
  const supabase = await supabaseServer();

  const { data: filmler, error } = await supabase
    .from("icerikler")
    .select("*")
    .eq("id", filmId)
    .single();

  if (error) {
    // not-found sayfasi eklenecek
    console.log(error);
    return {};
  }

  return filmler;
}

export async function diziyiGetir(diziId: number) {
  const supabase = await supabaseServer();

  const { data: dizi, error } = await supabase
    .from("icerikler")
    .select("*, dizi(sezon_numarasi, bolumler(*))")
    .eq("id", diziId)
    .single();

  if (error) {
    // not-found sayfasi eklenecek
    console.log(error);
    return {};
  }

  return dizi;
}

export async function favorileriGetir() {
  const supabase = await supabaseServer();

  // Kullanıcıyı al
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Favorileri getir
  const { data: favoriler, error } = await supabase
    .from("favoriler")
    .select("*")
    .eq("kullanici_id", user.id);

  if (error) {
    console.error(error);
    return [];
  }

  return favoriler || [];
}

export async function dahaSonraIzlenecekleriGetir() {
  const supabase = await supabaseServer();

  // Kullanıcıyı al
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Favorileri getir
  const { data: dahaSonraIzlenecekler, error } = await supabase
    .from("daha_sonra_izle")
    .select("*")
    .eq("kullanici_id", user.id);

  if (error) {
    console.error(error);
    return [];
  }

  return dahaSonraIzlenecekler || [];
}

export async function icerikYorumlariniGetir(icerikId: number) {
  const supabase = await supabaseServer();

  const { data: yorumlar, error } = await supabase
    .from("yorumlar")
    .select(
      `
      *,
      profiller(profil_fotografi, isim)
    `,
    )
    .eq("icerik_id", icerikId);

  if (error) {
    console.error(error);
    return [];
  }

  return yorumlar || [];
}

export async function profilFotografiniGetir(kullaniciId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("profiller")
    .select("profil_fotografi")
    .eq("id", kullaniciId)
    .single();

  if (error) {
    return "";
  }

  // data null olursa boş string döndür
  return data?.profil_fotografi ?? "";
}

export async function rapidApidenFilmleriGetir() {
  try {
    const res = await fetch("https://imdb-top-100-movies.p.rapidapi.com/", {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        "x-rapidapi-host": "imdb-top-100-movies.p.rapidapi.com",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.error("RapidAPI isteği başarısız oldu. Status:", res.status);
      const errorText = await res.text();
      console.error("RapidAPI Hata:", errorText);
      throw new Error(`RapidAPI'den veri alınamadı. Status: ${res.status}`);
    }

    const movies = await res.json();
    const topTenMovies = movies.slice(0, 10);
    return topTenMovies;
  } catch (error) {
    console.error("getMoviesFromRapidAPI fonksiyonunda hata:", error);
    return null;
  }
}

export async function tanitimlariGetir() {
  const supabase = await supabaseServer();

  const { data: tanitimlar, error } = await supabase
    .from("tanitimlar")
    .select("icerikler(*)");

  if (error) {
    console.error("Tanitim hatası:", error.message || error);
    return [];
  }

  if (!tanitimlar) {
    return [];
  }

  const slidesData = tanitimlar
    .map((tanitim) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const icerik: any = tanitim.icerikler;
      if (!icerik) return null;

      return {
        id: icerik.id,
        isim: icerik.isim,
        aciklama: icerik.aciklama || "Açıklama mevcut değil.",
        kategoriler: (icerik.turler || []).slice(0, 3).join(" | "),
        sure: `${icerik.sure || 0} dk`,
        tur: icerik.tur,
        poster: icerik.yan_fotograf || icerik.fotograf,
        link: `/icerikler/${icerik.tur === "film" ? "filmler/" : "diziler/"}${icerik.id}`,
      };
    })
    .filter(Boolean);

  return slidesData;
}

// Abonelik turlerini getir
export async function abonelikTurleriniGetir() {
  const supabase = await supabaseServer();

  const { data: plans, error } = await supabase
    .from("abonelik_paketleri")
    .select("*")
    .eq("aktif_mi", true)
    .order("fiyat", { ascending: true });

  if (error) {
    console.error("Planlar çekilemedi:", error);
    return [];
  }

  return plans;
}
