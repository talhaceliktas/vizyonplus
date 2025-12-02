import React, { Suspense } from "react";
import supabaseServer from "../../_lib/supabase/server";
import { kullaniciIzlemeGecmisiniGetir } from "../../_lib/data-service-server";
import SonIzlenenKart from "../../_components/profil/SonIzlenenKart";
import { History, PlayCircle } from "lucide-react"; // İkonu değiştirdim
import Link from "next/link";
import ProfilYanMenu from "../../_components/profil/ProfilYanMenu";
import Yukleniyor from "../../_components/ui/Yukleniyor";

const Page = async () => {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold text-white">Giriş Yapmalısınız</h2>
        <Link href="/login" className="text-yellow-500 hover:underline">
          Giriş Yap
        </Link>
      </div>
    );
  }

  // Yeni yazdığımız fonksiyonu çağırıyoruz
  const izlemeGecmisi = await kullaniciIzlemeGecmisiniGetir(user.id);

  return (
    <div className="flex w-full flex-col gap-x-10 gap-y-10 lg:flex-row">
      {/* --- YAN MENÜ --- */}
      <ProfilYanMenu routeHref="/profil/sonIzlenilenler" />

      {/* --- ANA İÇERİK --- */}
      <div className="flex-1">
        <Suspense fallback={<Yukleniyor />}>
          <div className="text-white">
            {/* Başlık Alanı */}
            <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="bg-secondary-1-2/10 text-secondary-1-2 flex h-12 w-12 items-center justify-center rounded-full">
                <History className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">
                  Son İzlenenler
                </h1>
                <p className="text-sm text-gray-400 md:text-base">
                  Yarım bıraktığın veya bitirdiğin {izlemeGecmisi.length} içerik
                  listeleniyor.
                </p>
              </div>
            </div>

            {/* Liste */}
            {izlemeGecmisi.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {izlemeGecmisi.map((kayit) => (
                  <SonIzlenenKart key={kayit.gecmis_id} kayit={kayit} />
                ))}
              </div>
            ) : (
              // BOŞ DURUM
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-white/5 bg-white/5 py-20 text-center">
                <PlayCircle className="h-16 w-16 text-gray-600 opacity-50" />
                <div>
                  <h3 className="text-xl font-bold text-gray-300">
                    Henüz izleme geçmişin yok.
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    İzlediğin içerikler kaldığın yerden devam edebilmen için
                    burada görünür.
                  </p>
                </div>
                <Link
                  href="/icerikler"
                  className="mt-2 rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95"
                >
                  Hemen Bir Şeyler İzle
                </Link>
              </div>
            )}
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
