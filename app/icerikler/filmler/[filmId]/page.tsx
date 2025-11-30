import { Suspense } from "react";
import {
  filmiGetir,
  aktifAboneligiGetir,
  filmeSahipMi,
  kullaniciPuaniniGetir, // 1. Yeni Fonksiyon Importu
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
import IcerikPuanla from "../../../_components/icerikler/dizi-film/IcerikPuanla"; // 2. Yeni Bileşen Importu

const Page = async ({ params }: { params: { filmId: number } }) => {
  const { filmId } = await params;

  // Verileri paralel çekmek performansı artırır
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

  // 3. Kullanıcının Mevcut Puanını Çek
  // Eğer kullanıcı yoksa null döner, varsa puanı döner
  const mevcutPuan = await kullaniciPuaniniGetir(id);

  // Erişim Kontrolleri
  const aboneMi = !!aktifAbonelik;
  const filmeSahip = await filmeSahipMi(id);

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
                {/* --- Üst Satır: İzle ve Satın Al --- */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* İzle Butonu */}
                  <div className="flex-1">
                    <IzleButonu
                      filmId={id}
                      aboneMi={aboneMi}
                      sahipMi={filmeSahip}
                    />
                  </div>

                  {/* Satın Al Butonu */}
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

                {/* --- Alt Satır: Aksiyonlar ve Puanlama --- */}
                {/* Grid yapısı ile yan yana hizalıyoruz */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Sol: Listem / Beğen Butonları */}
                  <div className="flex items-center">
                    <IcerikButonlari id={id} user={user} />
                  </div>

                  {/* Sağ: Puanlama Alanı (Sadece giriş yapmışsa) */}
                  {user && (
                    <div className="flex justify-start md:justify-end">
                      <IcerikPuanla icerikId={id} mevcutPuan={mevcutPuan} />
                    </div>
                  )}
                </div>
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
