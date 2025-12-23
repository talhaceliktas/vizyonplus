/**
 * Bu dosya, kullanıcıyla ilgili verileri (profil, favoriler, izleme geçmişi vb.)
 * veritabanından çekmek için kullanılan servis fonksiyonlarını içerir.
 */

import supabaseServer from "@lib/supabase/server";
import { Table } from "@/types";

/**
 * Belirli bir kullanıcının profil detaylarını çeker.
 */
export async function getUserProfile(userId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("profiller")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Profil bilgileri çekilemedi:", error);
    return null;
  }

  return data;
}

/**
 * Mevcut kullanıcının favori listesini (filmler ve diziler) getirir.
 */
export async function getFavorites() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("favoriler")
    .select(
      `
      icerikler_id,
      icerikler (
        id,
        isim,
        fotograf,
        tur,
        turler,
        aciklama,
        slug
      )
    `,
    )
    .eq("kullanici_id", user.id);

  if (error) {
    console.error("Favoriler çekilemedi:", error);
    return [];
  }

  return data;
}

/**
 * Mevcut kullanıcının "Daha Sonra İzle" listesini getirir.
 */
export async function getWatchList() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("daha_sonra_izle")
    .select(
      `
      icerikler_id,
      icerikler (
        id,
        isim,
        fotograf,
        tur,
        turler,
        aciklama,
        slug
      )
    `,
    )
    .eq("kullanici_id", user.id);

  if (error) {
    console.error("İzleme listesi çekilemedi:", error);
    return [];
  }

  return data;
}

/**
 * Mevcut kullanıcının izleme geçmişini getirir ve formatlar.
 * Film ve Dizi bölümlerini ayırt ederek, en son izlenenleri (deduplication yaparak) listeler.
 */
export async function getWatchHistory() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // Karmaşık sorgu: Hem filmleri hem de dizi bölümlerini ilişkili tablolarla çek
  const { data, error } = await supabase
    .from("izleme_gecmisi")
    .select(
      `
      id,
      kalinan_saniye,
      toplam_saniye,
      updated_at,
      film_id,
      bolum_id,
      icerikler!izleme_gecmisi_film_id_fkey (
        id, isim, fotograf, tur, video_url, slug
      ),
      bolumler!izleme_gecmisi_bolum_id_fkey (
        id, sezon_numarasi, bolum_numarasi,
        dizi:icerikler ( 
            id, isim, fotograf, tur, slug
        )
      )
    `,
    )
    .eq("kullanici_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Geçmiş hatası:", error.message);
    return [];
  }

  // Frontend'de göstermek için veriyi temizle ve tekilleştir
  const islenenIcerikler = new Set();
  const temizListe = [];

  for (const kayit of data) {
    let uniqueId = "";
    let icerikBilgisi: Table<"icerikler"> | null = null;
    let detay = "";

    // A. FİLM İSE
    if (kayit.film_id && kayit.icerikler) {
      const filmData = Array.isArray(kayit.icerikler)
        ? kayit.icerikler[0]
        : kayit.icerikler;

      uniqueId = `film-${filmData.id}`;
      icerikBilgisi = filmData as Table<"icerikler">;
    }
    // B. DİZİ BÖLÜMÜ İSE
    else if (kayit.bolum_id && kayit.bolumler) {
      const bolumData = Array.isArray(kayit.bolumler)
        ? kayit.bolumler[0]
        : kayit.bolumler;

      const diziData = Array.isArray(bolumData.dizi)
        ? bolumData.dizi[0]
        : bolumData.dizi;

      if (diziData) {
        const diziAnaBilgisi = diziData as Table<"icerikler">;

        uniqueId = `dizi-${diziAnaBilgisi.id}`;
        icerikBilgisi = diziAnaBilgisi;
        detay = `S${bolumData.sezon_numarasi}.B${bolumData.bolum_numarasi}`; // Örn: S1.B1
      }
    }

    // Listede daha önce eklenmemişse ekle (Tekilleştirme)
    if (uniqueId && icerikBilgisi && !islenenIcerikler.has(uniqueId)) {
      islenenIcerikler.add(uniqueId);

      temizListe.push({
        historyId: kayit.id,
        updatedAt: kayit.updated_at,
        watchedSeconds: kayit.kalinan_saniye,
        totalSeconds: kayit.toplam_saniye,
        percentage: (kayit.kalinan_saniye / (kayit.toplam_saniye || 1)) * 100, // İlerleme yüzdesi
        content: icerikBilgisi,
        detail: detay,
        type: kayit.film_id ? "film" : "dizi",
      });
    }
  }

  return temizListe;
}

/**
 * Kullanıcının puanladığı içerikleri getirir (Oylamalarım).
 */
export async function getUserRatings() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("icerik_puanlari")
    .select(
      `
      id,
      puan,
      created_at,
      icerik:icerikler (
        id,
        isim,
        fotograf,
        tur,
        slug,
        yayinlanma_tarihi,
        aciklama
      )
    `,
    )
    .eq("kullanici_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Puanlamalar çekilemedi:", error.message);
    return [];
  }

  // Veriyi düzgün bir formata çevirip dönelim
  // (Silinmiş içerikler null gelebilir, bunları filtreliyoruz)
  return data
    .filter((item) => item.icerik !== null)
    .map((item) => ({
      ratingId: item.id,
      rating: item.puan,
      ratedAt: item.created_at,
      content: item.icerik!,
    }));
}
