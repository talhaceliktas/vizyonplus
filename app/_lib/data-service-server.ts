"use server";

import { revalidatePath } from "next/cache";
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
    .select("*, film_ucretleri(satin_alma_ucreti)")
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

export async function aktifAboneligiGetir(userId: string) {
  const supabase = await supabaseServer();

  const simdi = new Date().toISOString();

  const { data, error } = await supabase
    .from("kullanici_abonelikleri")
    .select("*, abonelik_paketleri(*)")
    .eq("kullanici_id", userId)
    .gt("bitis_tarihi", simdi)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function abonelikTurleriniGetir() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("abonelik_paketleri")
    .select("*")
    .order("fiyat", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function otomatikYenilemeDegistir(
  abonelikId: string,
  yeniDurum: boolean,
) {
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from("kullanici_abonelikleri")
    .update({ otomatik_yenileme: yeniDurum })
    .eq("id", abonelikId);

  if (error) {
    console.error("Yenileme hatası:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function filmiSatinAl(filmId: number, fiyat: number) {
  const supabase = await supabaseServer();

  // 1. Kullanıcıyı al
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Oturum açmanız gerekiyor." };
  }

  // 2. Daha önce almış mı kontrol et (Mükerrer ödemeyi önle)
  const { data: mevcut } = await supabase
    .from("tekil_satin_almalar")
    .select("id")
    .eq("kullanici_id", user.id)
    .eq("film_id", filmId)
    .single();

  if (mevcut) {
    return { success: false, error: "Bu filmi zaten satın aldınız." };
  }

  // 3. Ödeme İşlemi (Mock - Burada Iyzico/Stripe vb. olur)
  // ... ödeme başarılı varsayıyoruz ...

  // 4. Filmi Kullanıcıya Tanımla
  const { error: satinAlmaError } = await supabase
    .from("tekil_satin_almalar")
    .insert({
      kullanici_id: user.id,
      film_id: filmId,
      fiyat: fiyat,
    });

  if (satinAlmaError) {
    console.error(satinAlmaError);
    return { success: false, error: "Satın alma kaydı oluşturulamadı." };
  }

  // 5. Finansal Log Tablosuna Yaz (Opsiyonel ama iyi pratik)
  await supabase.from("odemeler").insert({
    kullanici_id: user.id,
    tutar: fiyat,
    durum: "basarili",
    provider_odeme_id: `film_${filmId}_${Date.now()}`,
    odeme_yontemi: { type: "tekil_film", film_id: filmId },
  });

  // 6. Sayfayı yenile ki buton "İzle"ye dönsün
  revalidatePath(`/film/${filmId}`); // Film detay sayfasının yolunu buraya yaz

  return { success: true };
}

export async function filmeSahipMi(filmId: number) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: mevcut } = await supabase
    .from("tekil_satin_almalar")
    .select("id")
    .eq("kullanici_id", user.id)
    .eq("film_id", filmId)
    .single();

  if (!mevcut) return false;
  return true;
}

export async function puanVer(icerikId: number, puan: number) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Giriş yapmalısınız." };

  const { error } = await supabase.from("icerik_puanlari").upsert(
    { kullanici_id: user.id, icerik_id: icerikId, puan: puan },
    { onConflict: "kullanici_id, icerik_id" }, // Çakışma varsa güncelle
  );

  if (error) {
    console.error(error);
    return { error: "Puan kaydedilemedi." };
  }

  // Sayfayı yenile ki ortalama puan güncellensin
  revalidatePath(`/film/${icerikId}`);
  return { success: true };
}

export async function kullaniciPuaniniGetir(icerikId: number) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("icerik_puanlari")
    .select("puan")
    .eq("kullanici_id", user.id)
    .eq("icerik_id", icerikId)
    .single();

  return data?.puan || null;
}
