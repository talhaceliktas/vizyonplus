import supabaseServer from "@/lib/supabase/server";

// Slug, Sezon ve Bölüm numarasına göre bölümü getir
export async function getEpisodeBySlug(
  slug: string,
  sezonNo: number,
  bolumNo: number,
) {
  const supabase = await supabaseServer();

  // 1. Önce Slug'dan İçerik ID'sini ve detaylarını bulalım
  const { data: content, error: contentError } = await supabase
    .from("icerikler")
    .select("id, isim, yan_fotograf")
    .eq("slug", slug)
    .single();

  if (contentError || !content) return null;

  // 2. Şimdi bu ID'yi kullanarak bölümü çekelim
  const { data: episode, error: episodeError } = await supabase
    .from("bolumler")
    .select("*")
    .eq("icerik_id", content.id)
    .eq("sezon_numarasi", sezonNo)
    .eq("bolum_numarasi", bolumNo)
    .single();

  if (episodeError || !episode) return null;

  // 3. Navigasyon Kontrolü (Önceki/Sonraki var mı?)
  const [prevCheck, nextCheck] = await Promise.all([
    supabase
      .from("bolumler")
      .select("id")
      .eq("icerik_id", content.id)
      .match({ sezon_numarasi: sezonNo, bolum_numarasi: bolumNo - 1 })
      .single(),
    supabase
      .from("bolumler")
      .select("id")
      .eq("icerik_id", content.id)
      .match({ sezon_numarasi: sezonNo, bolum_numarasi: bolumNo + 1 })
      .single(),
  ]);

  return {
    episode,
    content, // Dizi bilgisi (Poster, ID vs.)
    hasPrev: !!prevCheck.data,
    hasNext: !!nextCheck.data,
  };
}

// İzleme süresini getir
export async function getEpisodeWatchTime(userId: string, episodeId: number) {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("izleme_gecmisi")
    .select("kalinan_saniye")
    .eq("kullanici_id", userId)
    .eq("bolum_id", episodeId)
    .single();

  return data?.kalinan_saniye || 0;
}
