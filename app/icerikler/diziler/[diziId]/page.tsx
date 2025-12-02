import { Suspense } from "react";
import {
  diziyiGetir,
  aktifAboneligiGetir,
  kullaniciPuaniniGetir,
  icerikOylamaBilgisiniGetir,
  enSonIzlenenBolumuGetir,
  icerikOrtalamasiniGetir, // <--- 1. YENİ IMPORT
} from "../../../_lib/data-service-server";
import { DiziSezon } from "../../../types";
import Loading from "../../../loading";
import Image from "next/image";
import Footer from "../../../_components/Footer";
import supabaseServerClient from "../../../_lib/supabase/server";
import IcerikButonlari from "../../../_components/icerikler/dizi-film/IcerikButonlari";
import Yorumlar from "../../../_components/icerikler/dizi-film/Yorumlar";
import DiziIcerigi from "../../../_components/icerikler/DiziIcerigi";
import DiziSezonKonteynir from "../../../_components/icerikler/diziler/DiziSezonKonteynir";
import IcerikPuanla from "../../../_components/icerikler/dizi-film/IcerikPuanla";
import IcerikOyla from "../../../_components/icerikler/IcerikOyla";
import IzleButonu from "../../../_components/icerikler/filmler/IzleButonu";

const Page = async ({ params }: { params: { diziId: string } }) => {
  // NOT: Next.js params her zaman string döner, o yüzden tipini string yaptım.
  const { diziId } = await params;

  const numericDiziId = Number(diziId);

  // 1. Verileri Çek
  const dizi: DiziSezon = await diziyiGetir(numericDiziId);
  const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Abonelik Kontrolü
  let aktifAbonelik = null;
  // Sadece kullanıcı varsa aboneliğe bak
  if (user) {
    aktifAbonelik = await aktifAboneligiGetir(user.id);
  }

  const aboneMi = !!aktifAbonelik;
  const { id, isim, fotograf } = dizi;

  // 3. Kullanıcının Verilerini Çek (SADECE USER VARSA)
  let mevcutPuan = null;
  let sonIzlenenBolum = null;

  // Kullanıcı giriş yapmışsa kişisel verileri çekiyoruz
  if (user) {
    mevcutPuan = await kullaniciPuaniniGetir(id);
    sonIzlenenBolum = await enSonIzlenenBolumuGetir(user.id, numericDiziId);
  }

  // 4. Genel Verileri Çek (Paralel çalışsın diye burada topladık)
  // Oylama durumu ve GENEL ORTALAMA verisi
  const oylamaDurumu = await icerikOylamaBilgisiniGetir(id);
  const genelPuanVerisi = await icerikOrtalamasiniGetir(id); // <--- 2. VERİYİ ÇEKTİK

  return (
    <Suspense fallback={<Loading />}>
      <div className="text-primary-50 px-4 pt-40 pb-20">
        <div className="mx-auto flex h-full w-full max-w-[1360px] flex-col gap-y-20">
          <div className="flex flex-col gap-x-10 gap-y-10 md:flex-row">
            {/* Sol: Kapak */}
            <div className="relative aspect-[9/16] w-full max-w-[400px] shrink-0">
              <Image
                alt={`${isim} dizi kapağı`}
                src={fotograf}
                className="rounded-xl object-cover shadow-2xl shadow-black/50"
                fill
                priority
              />
            </div>

            {/* Sağ: İçerik */}
            <div className="flex w-full flex-col gap-y-6">
              <DiziIcerigi dizi={dizi} />

              <IzleButonu
                aboneMi={aboneMi}
                icerikId={numericDiziId} // Number gönderiyoruz
                sahipMi={false}
                tur="dizi"
                sonIzlenen={sonIzlenenBolum}
              />

              {/* ... Diğer bileşenler aynı kalacak ... */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-center gap-x-4">
                  <IcerikButonlari id={id} user={user} />
                  <IcerikOyla icerikId={id} mevcutDurum={oylamaDurumu} />
                </div>

                {user && (
                  <div className="flex justify-start md:justify-end">
                    <IcerikPuanla
                      icerikId={id}
                      mevcutPuan={mevcutPuan}
                      genelPuan={genelPuanVerisi} // <--- 3. PROP OLARAK GEÇTİK
                    />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <DiziSezonKonteynir dizi={dizi} aboneMi={aboneMi} />
              </div>
            </div>
          </div>

          <Yorumlar icerikId={id} variant="default" />
        </div>
      </div>
      <Footer />
    </Suspense>
  );
};

export default Page;
