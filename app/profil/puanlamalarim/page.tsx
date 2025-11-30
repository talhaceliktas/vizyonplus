import React, { Suspense } from "react";
import supabaseServer from "../../_lib/supabase/server";
import { kullaniciPuanlamalariniGetir } from "../../_lib/data-service-server";
import PuanlananIcerikKarti from "../../_components/profil/PuanlananIcerikKarti";
import { Star } from "lucide-react";
import Link from "next/link";
import ProfilYanMenu from "../../_components/profil/ProfilYanMenu"; // Yan menü importu
import Yukleniyor from "../../_components/ui/Yukleniyor"; // Varsa loading bileşenin

const Page = async () => {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Kullanıcı yoksa login'e yönlendir veya mesaj göster
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

  const puanlamalar = await kullaniciPuanlamalariniGetir(user.id);

  return (
    <div className="flex w-full flex-col gap-x-10 gap-y-10 lg:flex-row">
      {/* --- YAN MENÜ --- */}
      {/* routeHref ile menüde hangi sekmenin aktif olduğunu belirtiyoruz */}
      <ProfilYanMenu routeHref="/profil/puanlamalarim" />

      {/* --- ANA İÇERİK --- */}
      <div className="flex-1">
        <Suspense fallback={<Yukleniyor />}>
          <div className="text-white">
            {/* Başlık Alanı */}
            <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
                <Star className="h-6 w-6 fill-current" />
              </div>
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">
                  Puanlamalarım
                </h1>
                <p className="text-sm text-gray-400 md:text-base">
                  Puan verdiğin {puanlamalar.length} içerik listeleniyor.
                </p>
              </div>
            </div>

            {/* Liste */}
            {puanlamalar.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {puanlamalar.map((kayit) => (
                  <PuanlananIcerikKarti key={kayit.id} kayit={kayit} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-white/5 bg-white/5 py-20 text-center">
                <Star className="h-16 w-16 text-gray-600 opacity-50" />
                <div>
                  <h3 className="text-xl font-bold text-gray-300">
                    Henüz hiçbir içeriği puanlamadın.
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    İzlediğin filmlere ve dizilere puan vererek burada
                    görebilirsin.
                  </p>
                </div>
                <Link
                  href="/icerikler"
                  className="mt-2 rounded-full bg-yellow-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-yellow-400 active:scale-95"
                >
                  İçerikleri Keşfet
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
