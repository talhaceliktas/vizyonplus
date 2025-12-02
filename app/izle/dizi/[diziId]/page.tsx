import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { notFound } from "next/navigation";

import {
  diziyiGetir,
  aktifAboneligiGetir,
  icerikOylamaBilgisiniGetir,
} from "../../../_lib/data-service-server";
import supabaseServerClient from "../../../_lib/supabase/server";
import Loading from "../../../loading";
import IzleNavbar from "../../../_components/izle/IzleNavbar";
import DiziSezonKonteynir from "../../../_components/icerikler/diziler/DiziSezonKonteynir";
import IcerikButonlari from "../../../_components/icerikler/dizi-film/IcerikButonlari";
import IcerikOyla from "../../../_components/icerikler/IcerikOyla";
import Yorumlar from "../../../_components/icerikler/dizi-film/Yorumlar";
import Footer from "../../../_components/Footer";

const Page = async ({ params }: { params: { diziId: string } }) => {
  const { diziId } = await params;
  const id = Number(diziId);

  // 1. Verileri Paralel Çekelim
  const diziDataPromise = diziyiGetir(id);
  const supabasePromise = supabaseServerClient();

  const dizi = await diziDataPromise;
  const supabase = await supabasePromise;

  // Dizi bulunamadıysa 404
  if (!dizi || !dizi.id) {
    notFound();
  }

  // 2. Kullanıcı Oturumu ve Abonelik Kontrolü
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let aktifAbonelik = null;
  let oylamaDurumu = null;

  if (user) {
    // Paralel sorgu: Abonelik durumu ve Beğeni durumu
    const [abonelik, begeni] = await Promise.all([
      aktifAboneligiGetir(user.id),
      icerikOylamaBilgisiniGetir(id),
    ]);
    aktifAbonelik = abonelik;
    oylamaDurumu = begeni;
  }

  const aboneMi = !!aktifAbonelik;

  // 3. İlk Bölümü Bul (Oynat butonu için)
  // Dizi tablosu -> Sezonlar -> Bölümler şeklinde iniyoruz.
  // Genelde 1. Sezon 1. Bölüm en mantıklısıdır.
  // Veri yapına göre sıralama yapıldığını varsayıyoruz.
  const ilkSezon = dizi.dizi?.[0]; // İlk sezon (Genelde Sezon 1)
  const ilkBolum = ilkSezon?.bolumler?.[0]; // İlk bölüm

  // Link: /izle/dizi/435/1/18 (DiziID / SezonNumarası / BölümID)
  // Not: Senin istediğin URL yapısına göre ayarlıyorum.
  const oynatLink = ilkBolum
    ? `/izle/dizi/${id}/${ilkSezon.sezon_numarasi}/${ilkBolum.bolum_numarasi}`
    : "#";

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* --- NAVBAR --- */}
      <IzleNavbar baslik={dizi.isim} />

      <div className="mx-auto max-w-[1400px] px-4 pt-24 pb-20 lg:px-8">
        <Suspense fallback={<Loading />}>
          {/* --- ÜST KISIM: DİZİ BİLGİLERİ --- */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            {/* SOL: Dizi Afişi */}
            <div className="relative aspect-[2/3] w-full max-w-[300px] shrink-0 self-center overflow-hidden rounded-xl shadow-2xl shadow-yellow-500/10 lg:self-start">
              <Image
                src={dizi.fotograf}
                alt={dizi.isim}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* SAĞ: Bilgiler ve Aksiyonlar */}
            <div className="flex flex-1 flex-col gap-6">
              {/* Başlık ve Meta */}
              <div>
                <h1 className="mb-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {dizi.isim}
                </h1>
                <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-400">
                  <span className="text-yellow-500">{dizi.tur}</span>
                  <span>•</span>
                  <span>{dizi.dizi?.length || 0} Sezon</span>
                  <span>•</span>
                  <span>{new Date(dizi.yayinlanma_tarihi).getFullYear()}</span>
                </div>
              </div>

              {/* Açıklama */}
              <p className="max-w-3xl text-lg leading-relaxed text-gray-300">
                {dizi.aciklama}
              </p>

              {/* Aksiyon Butonları */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Oynat Butonu */}
                {ilkBolum && (
                  <Link
                    href={oynatLink}
                    className={`group flex items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-bold transition-all active:scale-95 ${
                      aboneMi
                        ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 hover:bg-yellow-400"
                        : "bg-primary-800 hover:bg-primary-700 pointer-events-none cursor-not-allowed text-gray-300 opacity-80"
                    }`}
                  >
                    <Play className="h-6 w-6 fill-current" />
                    <span>
                      {aboneMi ? "1. Bölümü İzle" : "İzlemek İçin Abone Ol"}
                    </span>
                  </Link>
                )}

                {/* Listem / Beğen / Oyla */}
                <div className="flex items-center gap-4">
                  <IcerikButonlari id={id} user={user} />
                  {user && (
                    <IcerikOyla icerikId={id} mevcutDurum={oylamaDurumu} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- ALT KISIM: SEZONLAR ve BÖLÜMLER --- */}
          <div className="mt-16">
            <h2 className="mb-6 border-l-4 border-yellow-500 pl-4 text-2xl font-bold text-white">
              Bölümler
            </h2>

            {/* DiziSezonKonteynir bileşeni:
                - Abone ise bölümleri listeler.
                - Abone değilse "Kilitli" kartı gösterir.
            */}
            <DiziSezonKonteynir dizi={dizi} aboneMi={aboneMi} />
          </div>

          {/* --- YORUMLAR --- */}
          <div className="mt-16 border-t border-white/10 pt-10">
            <h2 className="mb-6 text-2xl font-bold text-white">Yorumlar</h2>
            <Yorumlar icerikId={id} variant="default" />
          </div>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
