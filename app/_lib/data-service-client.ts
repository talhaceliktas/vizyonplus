import supabaseClient from "./supabase/client";

export async function turleriGetir() {
  const { data: turler, error } = await supabaseClient.rpc("get_turler");

  return turler.map((turSatiri) => {
    return turSatiri.tur;
  });
}

export async function favoriIsaretliMi(gelenIceriklerId: string) {
  const {
    data: {
      user: { id },
    },
  } = await supabaseClient.auth.getUser();

  const { data: favoriFilm, error } = await supabaseClient
    .from("favoriler")
    .select("*")
    .eq("kullanici_id", id)
    .eq("icerikler_id", gelenIceriklerId);

  if (error) {
    // not-found sayfasi eklenecek
    console.log(error);
  }

  return Boolean(favoriFilm.length);
}

export async function favorilereEkle(gelenIceriklerId: string) {
  const isaretliMi = await favoriIsaretliMi(gelenIceriklerId);

  if (isaretliMi) {
    const { error } = await supabaseClient
      .from("favoriler")
      .delete()
      .eq("icerikler_id", gelenIceriklerId);
  } else {
    const { data, error } = await supabaseClient
      .from("favoriler")
      .insert([{ icerikler_id: gelenIceriklerId }]);
  }

  // if (error) {
  //   // not-found sayfasi eklenecek
  //   console.log(error);
  // }
}
