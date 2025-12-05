"use server";

import supabaseServer from "@lib/supabase/server";

export async function getComments(page: number, pageSize: number) {
  const supabase = await supabaseServer();

  // Sayfalama hesabı
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("admin_yorum_listesi") // Veritabanında bu isimde bir View olmalı
    .select("*", { count: "exact" })
    .order("olusturulma_zamani", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Yorum çekme hatası:", error);
    return { data: [], count: 0, error };
  }

  return { data, count, error: null };
}
