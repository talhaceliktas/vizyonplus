"use server";

import supabaseServer from "../../../lib/supabase/server";

export async function getCurrentSubscription(userId: string) {
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
