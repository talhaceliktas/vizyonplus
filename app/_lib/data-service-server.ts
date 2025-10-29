"use server";

import { FilmDetay } from "../types";
import supabaseServer from "./supabase/server";

export async function filmleriGetir() {
  const supabase = await supabaseServer();

  const { data: filmler, error } = await supabase
    .from("icerikler")
    .select(
      "isim, fotograf, turler, id, film_ucretleri(satin_alma_ucreti, indirim_orani, ogrenci_indirim_orani)",
    )
    .eq("tur", "film");

  if (error) {
    // not-found sayfasi eklenecek
    console.log(error);
    return [];
  }

  return filmler as FilmDetay[];
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
