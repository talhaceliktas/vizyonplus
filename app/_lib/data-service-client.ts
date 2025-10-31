import supabaseClient from "./supabase/client";

export async function turleriGetir() {
  const { data: turler } = await supabaseClient.rpc("get_turler");

  return turler.map((turSatiri: { tur: string }) => {
    return turSatiri.tur;
  });
}

// Favoriye ekleme islevleri

export async function favoriIsaretliMi(gelenIceriklerId: number) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    throw new Error("Kullanıcı bulunamadı!");
  }

  const { data: favoriFilm, error } = await supabaseClient
    .from("favoriler")
    .select("*")
    .eq("kullanici_id", user.id)
    .eq("icerikler_id", gelenIceriklerId);

  if (error) {
    // not-found sayfasi eklenecek
    console.log(error);
  }

  return Boolean(favoriFilm?.length);
}

export async function favorilereEkle(gelenIceriklerId: number) {
  const isaretliMi = await favoriIsaretliMi(gelenIceriklerId);
  let error = null;

  if (isaretliMi) {
    const { error: deleteError } = await supabaseClient
      .from("favoriler")
      .delete()
      .eq("icerikler_id", gelenIceriklerId);
    error = deleteError;
  } else {
    const { error: insertError } = await supabaseClient
      .from("favoriler")
      .insert([{ icerikler_id: gelenIceriklerId }]);
    error = insertError;
  }

  if (error) {
    console.error("Favori işlemi hatası:", error.message || error);
  } else {
    console.log("Favori işlemi başarılı!");
  }
}

// Daha sonra izleme islevleri

export async function dahaSonraIzleIsaretliMi(gelenIceriklerId: number) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    throw new Error("Kullanıcı bulunamadı!");
  }

  const { data: favoriFilm, error } = await supabaseClient
    .from("daha_sonra_izle")
    .select("*")
    .eq("kullanici_id", user.id)
    .eq("icerikler_id", gelenIceriklerId);

  if (error) {
    // not-found sayfasi eklenecek
    console.log(error);
  }

  return Boolean(favoriFilm?.length);
}

export async function dahaSonraIzleEkle(gelenIceriklerId: number) {
  const isaretliMi = await dahaSonraIzleIsaretliMi(gelenIceriklerId);
  let error = null;

  if (isaretliMi) {
    const { error: deleteError } = await supabaseClient
      .from("daha_sonra_izle")
      .delete()
      .eq("icerikler_id", gelenIceriklerId);
    error = deleteError;
  } else {
    const { error: insertError } = await supabaseClient
      .from("daha_sonra_izle")
      .insert([{ icerikler_id: gelenIceriklerId }]);
    error = insertError;
  }

  if (error) {
    console.error("Daha Sonra İzle işlemi hatası:", error.message || error);
  } else {
    console.log("Daha Sonra İzle başarılı!");
  }
}

export async function yorumYap(
  icerikId: number,
  yorum: string,
  spoilerVar: boolean,
) {
  const { error } = await supabaseClient
    .from("yorumlar")
    .insert([{ icerik_id: icerikId, yorum, spoiler_mi: spoilerVar }]);

  if (error) {
    console.error("Daha Sonra İzle işlemi hatası:", error.message || error);
    return false;
  }

  return true;
}
