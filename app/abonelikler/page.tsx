import AbonelikPlanlari from "../_components/abonelikler/AbonelikPlanlari";
import { abonelikTurleriniGetir } from "../_lib/data-service-server";

export default async function Page() {
  const plans = await abonelikTurleriniGetir();

  return <AbonelikPlanlari dbPlanlar={plans || []} />;
}
