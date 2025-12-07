import supabaseClient from "@lib/supabase/client";

export async function searchContent(arama: string, signal: AbortSignal) {
  const { data: icerikler, error } = await supabaseClient
    .from("icerikler")
    .select("id, isim, fotograf, tur, aciklama, slug")
    .ilike("isim", `%${arama}%`)
    .abortSignal(signal)
    .limit(6);

  return icerikler;
}
