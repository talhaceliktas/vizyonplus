import supabase from "./supabase";

export async function filmleriGetir() {
  const { data: filmler, error } = await supabase
    .from("icerikler")
    .select("*")
    .eq("tur", "film");

  if (error) {
    // not-found sayfasi eklenecek
    console.log(error);
    return [];
  }

  return filmler;
}
