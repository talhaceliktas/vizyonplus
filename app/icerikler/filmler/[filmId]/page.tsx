import { Suspense } from "react";
import {
  filmiGetir,
  aktifAboneligiGetir,
  filmeSahipMi,
} from "../../../_lib/data-service-server";
import Loading from "../../../loading";
import Image from "next/image";
import Footer from "../../../_components/Footer";
import supabaseServerClient from "../../../_lib/supabase/server";
import IcerikButonlari from "../../../_components/icerikler/dizi-film/IcerikButonlari";
import FilmIcerigi from "../../../_components/icerikler/FilmIcerigi";
import Yorumlar from "../../../_components/icerikler/dizi-film/Yorumlar";
import IzleButonu from "../../../_components/icerikler/filmler/IzleButonu";
import SatinAlButonu from "../../../_components/icerikler/filmler/SatinAlButonu";

const Page = async ({ params }: { params: { filmId: number } }) => {
  const { filmId } = await params;

  // Verileri paralel çekmek performansı artırır (Opsiyonel ama önerilir)
  const filmPromise = filmiGetir(filmId);
  const supabasePromise = supabaseServerClient();

  const film = await filmPromise;
  const supabase = await supabasePromise;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let aktifAbonelik = null;
  if (user) {
    aktifAbonelik = await aktifAboneligiGetir(user.id);
  }

  const { id, isim, fotograf } = film;

  // Erişim Kontrolleri
  const aboneMi = !!aktifAbonelik;
  const filmeSahip = await filmeSahipMi(id); // Bu fonksiyonun user.id'yi içeriden aldığını varsayıyorum

  // Satın al butonu görünmeli mi? (Abone değilse VE filme sahip değilse)
  const satinAlGoster = !aboneMi && !filmeSahip;

  return (
    <Suspense fallback={<Loading />}>
      <div className="text-primary-50 px-4 pt-40 pb-20">
        <div className="mx-auto flex h-full w-full max-w-[1360px] flex-col gap-y-20">
          <div className="flex flex-col gap-x-10 gap-y-10 md:flex-row">
            {/* SOL: Film Kapağı */}
            <div className="relative aspect-[9/16] w-full max-w-[400px] shrink-0">
              <Image
                alt={`${isim} filmi kapağı`}
                src={fotograf}
                className="rounded-xl object-cover shadow-2xl shadow-black/50"
                fill
                priority
              />
            </div>

            {/* SAĞ: İçerik */}
            <div className="flex w-full flex-col gap-y-8">
              <FilmIcerigi film={film} />

              {/* BUTON ALANI */}
              <div className="flex flex-col gap-6">
                {/* Ana Aksiyonlar (İzle & Satın Al) */}
                {/* Mobilde alt alta (flex-col), Masaüstünde yan yana (sm:flex-row) */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* İzle Butonu: Her zaman genişlemeye çalışır (flex-1) */}
                  <div className="flex-1">
                    <IzleButonu
                      filmId={id}
                      aboneMi={aboneMi}
                      sahipMi={filmeSahip} // İzle butonunu bu prop'u alacak şekilde güncellediğinden emin ol
                    />
                  </div>

                  {/* Satın Al Butonu: Sadece gerekirse gösterilir */}
                  {satinAlGoster && (
                    <div className="shrink-0">
                      <SatinAlButonu
                        filmId={id}
                        fiyat={film.film_ucretleri[0].satin_alma_ucreti}
                        filmAdi={film.isim}
                      />
                    </div>
                  )}
                </div>

                {/* Alt Aksiyonlar (Listem, Beğen vb.) */}
                <IcerikButonlari id={id} user={user} />
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
