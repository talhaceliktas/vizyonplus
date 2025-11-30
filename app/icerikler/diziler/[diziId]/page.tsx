import { Suspense } from "react";
import {
  diziyiGetir,
  aktifAboneligiGetir,
} from "../../../_lib/data-service-server"; // aktifAboneligiGetir eklendi
import { DiziSezon } from "../../../types";
import Loading from "../../../loading";
import Image from "next/image";
import Footer from "../../../_components/Footer";
import supabaseServerClient from "../../../_lib/supabase/server";
import IcerikButonlari from "../../../_components/icerikler/dizi-film/IcerikButonlari";
import Yorumlar from "../../../_components/icerikler/dizi-film/Yorumlar";
import DiziIcerigi from "../../../_components/icerikler/DiziIcerigi";
import DiziSezonKonteynir from "../../../_components/icerikler/diziler/DiziSezonKonteynir";

const Page = async ({ params }: { params: { diziId: number } }) => {
  const { diziId } = await params;

  // 1. Verileri Çek
  const dizi: DiziSezon = await diziyiGetir(diziId);
  const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Abonelik Kontrolü
  let aktifAbonelik = null;
  if (user) {
    aktifAbonelik = await aktifAboneligiGetir(user.id);
  }

  // Abone mi? (Boolean çevrimi)
  const aboneMi = !!aktifAbonelik;

  const { id, isim, fotograf } = dizi;

  return (
    <Suspense fallback={<Loading />}>
      <div className="text-primary-50 px-4 pt-40 pb-20">
        <div className="mx-auto flex h-full w-full max-w-[1360px] flex-col gap-y-20">
          <div className="flex flex-col gap-x-10 gap-y-10 md:flex-row">
            {/* Sol: Kapak */}
            <div className="relative aspect-[9/16] w-full max-w-[400px]">
              <Image
                alt={`${isim} filmi kapağı`}
                src={fotograf}
                className="rounded-xl object-cover shadow-2xl"
                fill
              />
            </div>

            {/* Sağ: İçerik */}
            <div className="flex w-full flex-col gap-y-6">
              <DiziIcerigi dizi={dizi} />

              <IcerikButonlari id={id} user={user} />

              {/* Sezon Konteynırı (Abone durumunu iletiyoruz) */}
              <div className="mt-8">
                <DiziSezonKonteynir dizi={dizi} aboneMi={aboneMi} />
              </div>
            </div>
          </div>

          <Yorumlar icerikId={id} />
        </div>
      </div>
      <Footer />
    </Suspense>
  );
};

export default Page;
