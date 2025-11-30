import AbonelikPlanlari from "../_components/abonelikler/AbonelikPlanlari";
import AbonelikYonetimi from "../_components/abonelikler/AbonelikYonetimi"; // Yeni oluşturacağımız bileşen
import {
  abonelikTurleriniGetir,
  aktifAboneligiGetir,
} from "../_lib/data-service-server";
import supabaseServerClient from "../_lib/supabase/server";

export default async function Page() {
  const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let aktifAbonelik = null;
  if (user) {
    aktifAbonelik = await aktifAboneligiGetir(user.id);
  }

  if (aktifAbonelik) {
    return <AbonelikYonetimi abonelik={aktifAbonelik} />;
  }

  const plans = await abonelikTurleriniGetir();
  return <AbonelikPlanlari dbPlanlar={plans || []} />;
}
