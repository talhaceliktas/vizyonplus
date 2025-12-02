import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, RotateCcw } from "lucide-react"; // İkon ekledik
import { notFound } from "next/navigation";

import {
  diziyiGetir,
  aktifAboneligiGetir,
  icerikOylamaBilgisiniGetir,
  enSonIzlenenBolumuGetir, // YENİ FONKSİYON
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

  // 1. Temel Verileri Çek
  const diziDataPromise = diziyiGetir(id);
  const supabasePromise = supabaseServerClient();

  const dizi = await diziDataPromise;
  const supabase = await supabasePromise;

  if (!dizi || !dizi.id) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let aktifAbonelik = null;
  let oylamaDurumu = null;
  let sonIzlenenKayit = null; // Yeni değişken

  // 2. Kullanıcı Varsa Ek Verileri Çek
  if (user) {
    const [abonelik, begeni, sonIzlenen] = await Promise.all([
      aktifAboneligiGetir(user.id),
      icerikOylamaBilgisiniGetir(id),
      enSonIzlenenBolumuGetir(user.id, id), // Kullanıcının bu dizideki geçmişi
    ]);
    aktifAbonelik = abonelik;
    oylamaDurumu = begeni;
    sonIzlenenKayit = sonIzlenen;
  }

  const aboneMi = !!aktifAbonelik;

  // --- OYNAT BUTONU MANTIĞI ---
  let oynatButonMetni = "1. Bölümü İzle";
  let oynatLink = "#";
  let Icon = Play;

  // Varsayılan: 1. Sezon 1. Bölüm
  const ilkSezon = dizi.dizi?.[0];
  const ilkBolum = ilkSezon?.bolumler?.[0];

  if (sonIzlenenKayit && sonIzlenenKayit.bolumler) {
    // DURUM A: Kullanıcı daha önce izlemiş -> Kaldığı yerden devam et
    const {
      sezon_numarasi,
      bolum_numarasi,
      id: bolumId,
    } = sonIzlenenKayit.bolumler;

    oynatButonMetni = `S${sezon_numarasi}:B${bolum_numarasi} Devam Et`;
    // Link yapısı: /izle/dizi/[diziId]/[sezonNo]/[bolumNo]
    oynatLink = `/izle/dizi/${id}/${sezon_numarasi}/${bolum_numarasi}`;
    Icon = RotateCcw; // Devam et ikonu
  } else if (ilkBolum) {
    // DURUM B: Hiç izlememiş -> En baştan başla
    oynatLink = `/izle/dizi/${id}/${ilkSezon.sezon_numarasi}/${ilkBolum.bolum_numarasi}`;
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* --- NAVBAR --- */}
      <IzleNavbar baslik={dizi.isim} />

      <div className="mx-auto max-w-[1400px] px-4 pt-24 pb-20 lg:px-8">
        <Suspense fallback={<Loading />}>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            {/* Dizi Afişi */}
            <div className="relative aspect-[2/3] w-full max-w-[300px] shrink-0 self-center overflow-hidden rounded-xl shadow-2xl shadow-yellow-500/10 lg:self-start">
              <Image
                src={dizi.fotograf}
                alt={dizi.isim}
                fill
                className="object-cover"
                priority
              />
            </div>

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
                {/* DİNAMİK OYNAT BUTONU */}
                <Link
                  href={oynatLink}
                  className={`group flex items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-bold transition-all active:scale-95 ${
                    aboneMi
                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 hover:bg-yellow-400"
                      : "bg-primary-800 hover:bg-primary-700 pointer-events-none cursor-not-allowed text-gray-300 opacity-80"
                  }`}
                >
                  {/* İkonu da dinamik yaptık (Play veya Devam Et) */}
                  <Icon className="h-6 w-6 fill-current" />
                  <span>
                    {aboneMi ? oynatButonMetni : "İzlemek İçin Abone Ol"}
                  </span>
                </Link>

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
