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
    console.error("Yorum işlemi hatası:", error.message || error);
    return false;
  }

  return true;
}

export async function aramaYap(arama: string, signal: AbortSignal) {
  const { data: icerikler, error } = await supabaseClient
    .from("icerikler")
    .select("id, isim, fotograf, tur, aciklama")
    .ilike("isim", `%${arama}%`)
    .abortSignal(signal)
    .limit(6);

  if (error) {
    if (error.name !== "AbortError") {
      console.error("Arama işlemi hatası:", error.message || error);
    }
  }

  return icerikler;
}

// Admin Komutlari

export const yorumlariCekAdmin = async (page: number, limit: number) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseClient
    .from("admin_yorum_listesi")
    .select("*", { count: "exact" })
    .order("olusturulma_zamani", { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
    return { data: [], count: 0, durum: "basarisiz" };
  }
  return { data, count, durum: "basarili" };
};

export const yorumuSilAdmin = async (id: number) => {
  const { error } = await supabaseClient.from("yorumlar").delete().eq("id", id);

  if (error) {
    console.error(error);
    return { durum: "basarisiz" };
  }
  return { durum: "basarili" };
};

export const kullanicilariCekAdmin = async (page: number, limit: number) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseClient
    .from("profiller")
    .select("*", { count: "exact" })
    .order("olusturulma_zamani", { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
    return { data: [], count: 0, durum: "basarisiz" };
  }
  return { data, count, durum: "basarili" };
};

export const kullaniciIsimGuncelle = async (id: string, yeniIsim: string) => {
  const { error } = await supabaseClient
    .from("profiller")
    .update({ isim: yeniIsim })
    .eq("id", id);

  if (error) return { durum: "basarisiz", hata: error.message };
  return { durum: "basarili" };
};

export const kullaniciBanDurumuDegistir = async (
  id: string,
  suankiDurum: boolean,
) => {
  const { error } = await supabaseClient
    .from("profiller")
    .update({ yasakli_mi: !suankiDurum })
    .eq("id", id);

  if (error) return { durum: "basarisiz", hata: error.message };
  return { durum: "basarili" };
};
