import { Suspense } from "react";
import AbonelikPlanlari from "../../_components/abonelikler/AbonelikPlanlari";
import AbonelikYonetimi from "../../_components/abonelikler/AbonelikYonetimi";
import ProfilYanMenu from "../../_components/profil/ProfilYanMenu"; // Yan menü
import Yukleniyor from "../../_components/ui/Yukleniyor"; // Loading
import {
  abonelikTurleriniGetir,
  aktifAboneligiGetir,
} from "../../_lib/data-service-server";
import supabaseServerClient from "../../_lib/supabase/server";

export default async function Page() {
  const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let aktifAbonelik = null;
  if (user) {
    aktifAbonelik = await aktifAboneligiGetir(user.id);
  }

  // Eğer aktif abonelik yoksa planları çek
  const plans = !aktifAbonelik ? await abonelikTurleriniGetir() : [];

  return (
    <div className="flex w-full flex-col gap-x-10 gap-y-10 lg:flex-row">
      {/* --- YAN MENÜ --- */}
      <ProfilYanMenu routeHref="/profil/abonelikler" />

      {/* --- ANA İÇERİK --- */}
      <div className="flex-1">
        <Suspense fallback={<Yukleniyor />}>
          {aktifAbonelik ? (
            /* Yönetim Paneli */
            <AbonelikYonetimi abonelik={aktifAbonelik} />
          ) : (
            /* Satın Alma Planları */
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl font-bold text-white">
                  Abonelik Planları
                </h1>
                <p className="text-sm text-gray-400">
                  Size uygun planı seçerek ayrıcalıklardan yararlanın.
                </p>
              </div>
              <AbonelikPlanlari dbPlanlar={plans || []} />
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
