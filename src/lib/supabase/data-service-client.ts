"use client";

import supabase from "./client";

export async function checkFavorite(icerikId: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("favoriler")
    .select("id")
    .eq("kullanici_id", user.id)
    .eq("icerikler_id", icerikId)
    .single();

  return !!data;
}

export async function updateFavorite(icerikId: number, ekle: boolean) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Giriş yapılmalı");

  if (ekle) {
    const { error } = await supabase
      .from("favoriler")
      .insert([{ icerikler_id: icerikId, kullanici_id: user.id }]);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("favoriler")
      .delete()
      .eq("icerikler_id", icerikId)
      .eq("kullanici_id", user.id);
    if (error) throw error;
  }
}

export async function checkWatchList(icerikId: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("daha_sonra_izle")
    .select("id")
    .eq("kullanici_id", user.id)
    .eq("icerikler_id", icerikId)
    .single();

  return !!data;
}

export async function updateWatchList(icerikId: number, ekle: boolean) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Giriş yapılmalı");

  if (ekle) {
    const { error } = await supabase
      .from("daha_sonra_izle")
      .insert([{ icerikler_id: icerikId, kullanici_id: user.id }]);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("daha_sonra_izle")
      .delete()
      .eq("icerikler_id", icerikId)
      .eq("kullanici_id", user.id);
    if (error) throw error;
  }
}
