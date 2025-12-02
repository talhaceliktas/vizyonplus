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

export async function profilBilgileriniGetir(kullaniciId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("profiller")
    .select("*")
    .eq("id", kullaniciId)
    .single();

  if (error) {
    return "";
  }

  // data null olursa boş string döndür
  return data ?? [];
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

export async function kullaniciPuanlamalariniGetir(userId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("icerik_puanlari")
    .select("*, icerikler(*)") // İlişkili film/dizi bilgisini de al
    .eq("kullanici_id", userId)
    .order("created_at", { ascending: false }); // En son puanlanan en üstte

  if (error) {
    console.error("Puanlamalar çekilemedi:", error);
    return [];
  }

  return data;
}

export async function puaniKaldir(puanId: number) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Yetkisiz işlem" };

  const { error } = await supabase
    .from("icerik_puanlari")
    .delete()
    .eq("id", puanId)
    .eq("kullanici_id", user.id); // Güvenlik: Sadece kendi puanını silebilir

  if (error) return { error: error.message };

  revalidatePath("/profil/puanlamalar"); // Listeyi yenile
  // Eğer filmin kendi sayfasındaysa orayı da yenilemek isteyebilirsin
  return { success: true };
}

export async function profiliGuncelle(formData: FormData) {
  const supabase = await supabaseServer();

  // 1. Form verilerini al
  const adSoyad = formData.get("adSoyad") as string;
  const cinsiyet = formData.get("cinsiyet") as string;

  // Basit validasyon
  if (!adSoyad || adSoyad.length < 3) {
    return { success: false, error: "Ad Soyad en az 3 karakter olmalıdır." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Oturum açmanız gerekiyor." };
  }

  try {
    const { error: authError } = await supabase.auth.updateUser({
      data: { display_name: adSoyad },
    });

    if (authError)
      throw new Error("Auth güncelleme hatası: " + authError.message);

    const { error: dbError } = await supabase
      .from("profiller")
      .update({
        isim: adSoyad,
        cinsiyet,
      })
      .eq("id", user.id);

    if (dbError) throw new Error("Veritabanı hatası: " + dbError.message);

    revalidatePath("/profil/ayarlar");
    revalidatePath("/", "layout");

    return { success: true, message: "Profil başarıyla güncellendi." };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message || "Bir hata oluştu." };
  }
}

export async function sifreyiGuncelle(formData: FormData) {
  const supabase = await supabaseServer();

  // 1. Form verilerini al
  const mevcutParola = formData.get("mevcutParola") as string;
  const yeniParola = formData.get("yeniParola") as string;
  const yeniParolaDogrula = formData.get("yeniParolaDogrula") as string;

  // 2. Basit Validasyonlar
  if (!mevcutParola || !yeniParola || !yeniParolaDogrula) {
    return { success: false, error: "Lütfen tüm alanları doldurun." };
  }

  if (yeniParola.length < 8) {
    return { success: false, error: "Yeni şifre en az 8 karakter olmalıdır." };
  }

  if (yeniParola !== yeniParolaDogrula) {
    return { success: false, error: "Yeni şifreler birbiriyle eşleşmiyor." };
  }

  // 3. Mevcut Kullanıcıyı Al
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return { success: false, error: "Oturum hatası." };
  }

  // 4. Mevcut Şifreyi Doğrula (SignIn Denemesi ile)
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: mevcutParola,
  });

  if (signInError) {
    return { success: false, error: "Mevcut şifreniz hatalı." };
  }

  // 5. Yeni Şifreyi Güncelle
  const { error: updateError } = await supabase.auth.updateUser({
    password: yeniParola,
  });

  if (updateError) {
    return {
      success: false,
      error: "Güncelleme hatası: " + updateError.message,
    };
  }

  return { success: true, message: "Şifreniz başarıyla güncellendi." };
}

export async function icerikOylamaBilgisiniGetir(icerikId: number) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("begeniler")
    .select("durum")
    .eq("kullanici_id", user.id)
    .eq("icerik_id", icerikId)
    .maybeSingle();

  return data?.durum ?? null;
}

export async function icerikOyla(icerikId: number, durum: boolean) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Giriş yapmalısınız." };

  const { data: mevcut } = await supabase
    .from("begeniler")
    .select("durum")
    .eq("kullanici_id", user.id)
    .eq("icerik_id", icerikId)
    .single();

  if (mevcut && mevcut.durum === durum) {
    await supabase
      .from("begeniler")
      .delete()
      .eq("kullanici_id", user.id)
      .eq("icerik_id", icerikId);

    revalidatePath(`/izle/film/${icerikId}`);
    return { success: true, message: "Oylama kaldırıldı", removed: true };
  }

  const { error } = await supabase.from("begeniler").upsert(
    {
      kullanici_id: user.id,
      icerik_id: icerikId,
      durum: durum,
      guncellenme_zamani: new Date().toISOString(),
    },
    { onConflict: "kullanici_id, icerik_id" },
  );

  if (error) return { success: false, error: error.message };

  revalidatePath(`/izle/film/${icerikId}`);
  return {
    success: true,
    message: durum ? "Beğendin 👍" : "Geri bildirim alındı 👎",
  };
}

export async function izlemeGecmisiGuncelle({
  filmId,
  bolumId,
  saniye,
  toplamSaniye,
}) {
  const supabase = await supabaseServer();

  // 1. Kullanıcıyı kontrol et
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const izlenmeOrani = saniye / toplamSaniye;
  const bittiMi = izlenmeOrani > 0.95;

  // 3. Veritabanına kaydet (Upsert)
  const { error } = await supabase.from("izleme_gecmisi").upsert(
    {
      kullanici_id: user.id,
      // Eğer filmId varsa onu, yoksa null
      film_id: filmId || null,
      // Eğer bolumId varsa onu, yoksa null
      bolum_id: bolumId || null,
      kalinan_saniye: saniye,
      toplam_saniye: toplamSaniye,
      bitti_mi: bittiMi,
      updated_at: new Date().toISOString(),
    },
    {
      // Hangi unique constraint'e göre güncelleme yapacağını belirtiyoruz
      onConflict: filmId ? "kullanici_id, film_id" : "kullanici_id, bolum_id",
    },
  );

  if (error) {
    console.error("İzleme kaydı hatası:", error.message);
  }
}

export async function bolumYorumlariniGetir(bolumId: number) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("bolum_yorumlari")
    .select("*, profiller(isim, profil_fotografi)") // Profili de çekiyoruz
    .eq("bolum_id", bolumId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Yorum çekme hatası:", error);
    return [];
  }
  return data;
}

// --- BÖLÜME YORUM YAP ---
export async function bolumeYorumYap(
  bolumId: number,
  yorum: string,
  spoiler: boolean,
) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Giriş yapmalısınız." };

  const { error } = await supabase.from("bolum_yorumlari").insert({
    kullanici_id: user.id,
    bolum_id: bolumId,
    yorum: yorum,
    spoiler_mi: spoiler,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/izle/dizi/[diziId]/[sezonNo]/[bolumNo]`); // Dinamik path'i tetiklemesi zor olabilir, o yüzden layout'u yenilemek daha iyi
  return { success: true };
}

export async function enSonIzlenenBolumuGetir(userId: string, diziId: number) {
  const supabase = await supabaseServer();

  // Debug için log (Sorun çözülünce silebilirsin)
  // console.log("Sorgu Başlıyor:", { userId, diziId });

  const { data, error } = await supabase
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
    .eq("bolumler.icerik_id", diziId) // diziId number olmalı
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle(); // .single() yerine .maybeSingle() kullanmak hata fırlatmasını engeller ve null döner

  if (error) {
    console.error("Geçmiş Getirme Hatası:", error.message);
    return null;
  }

  return data;
}

export async function filminIzlenmeBilgisiniGetir(
  userId: string,
  filmId: number,
) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("izleme_gecmisi")
    .select(
      `
      kalinan_saniye,
      toplam_saniye,
      updated_at
    `, // <-- Buradaki sondaki virgülü kaldırdık
    )
    .eq("kullanici_id", userId)
    .eq("film_id", filmId) // DB'de kolon adı 'film_id' ise doğru
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Geçmiş Getirme Hatası:", error.message);
    return null;
  }

  return data;
}
