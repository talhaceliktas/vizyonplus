import supabase from "./supabase";

export async function filmleriGetir() {
  const { data: filmler, error } = await supabase
    .from("icerikler")
    .select("isim, fotograf, turler, id")
    .eq("tur", "film");

  if (error) {
    // not-found sayfasi eklenecek
    console.log(error);
    return [];
  }

  return filmler;
}

export async function filmiGetir(filmId: number) {
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
