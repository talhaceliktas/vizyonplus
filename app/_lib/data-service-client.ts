import supabaseClient from "./supabase/client";

export async function turleriGetir() {
  const { data: turler, error } = await supabaseClient.rpc("get_turler");

  return turler.map((turSatiri) => {
    return turSatiri.tur;
  });
}
