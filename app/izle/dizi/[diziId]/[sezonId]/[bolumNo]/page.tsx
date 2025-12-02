import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, List } from "lucide-react";

import { diziyiGetir } from "../../../../../_lib/data-service-server";
import supabaseServerClient from "../../../../../_lib/supabase/server";
import CustomVideoPlayer from "../../../../../_components/izle/CustomVideoPlayer";
import IzleNavbar from "../../../../../_components/izle/IzleNavbar";
import YorumlarDizi from "../../../../../_components/izle/YorumlarDizi";
import YorumYapDizi from "../../../../../_components/izle/YorumYapDizi";

type PageProps = {
  params: {
    diziId: string;
    sezonId: string;
    bolumNo: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const { diziId, sezonId, bolumNo } = await params;
  const diziIdNum = Number(diziId);
  const sezonNum = Number(sezonId);
  const bolumNum = Number(bolumNo);

  // 1. Verileri Çek
  const dizi = await diziyiGetir(diziIdNum);
  const supabase = supabaseServerClient(); // await gerekmez

  if (!dizi || !dizi.id) return notFound();

  // 2. Bölümü Bul
  const aktifSezon = dizi.dizi?.find((s) => s.sezon_numarasi === sezonNum);
  const aktifBolum = aktifSezon?.bolumler?.find(
    (b) => b.bolum_numarasi === bolumNum,
  );

  if (!aktifBolum) return notFound();

  // 3. Kullanıcı ve Geçmiş
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  let baslangicSaniyesi = 0;

  if (user) {
    // Sadece izleme geçmişini çekmemiz yeterli (Abonelik kontrolü middleware veya layout'ta olabilir)
    const { data: gecmis } = await (await supabase)
      .from("izleme_gecmisi")
      .select("kalinan_saniye")
      .eq("kullanici_id", user.id)
      .eq("bolum_id", aktifBolum.id)
      .single();

    if (gecmis) baslangicSaniyesi = gecmis.kalinan_saniye;
  }

  // --- NAVİGASYON ---
  let sonrakiLink = null;
  const ayniSezonSonrakiBolum = aktifSezon.bolumler.find(
    (b) => b.bolum_numarasi === bolumNum + 1,
  );

  if (ayniSezonSonrakiBolum) {
    sonrakiLink = `/izle/dizi/${diziIdNum}/${sezonNum}/${bolumNum + 1}`;
  } else {
    const sonrakiSezon = dizi.dizi.find(
      (s) => s.sezon_numarasi === sezonNum + 1,
    );
    if (sonrakiSezon?.bolumler?.length > 0) {
      sonrakiLink = `/izle/dizi/${diziIdNum}/${sezonNum + 1}/1`;
    }
  }

  let oncekiLink = null;
  if (bolumNum > 1) {
    oncekiLink = `/izle/dizi/${diziIdNum}/${sezonNum}/${bolumNum - 1}`;
  } else if (sezonNum > 1) {
    const oncekiSezon = dizi.dizi.find(
      (s) => s.sezon_numarasi === sezonNum - 1,
    );
    if (oncekiSezon) {
      const sonBolumNo = Math.max(
        ...oncekiSezon.bolumler.map((b) => b.bolum_numarasi),
      );
      oncekiLink = `/izle/dizi/${diziIdNum}/${sezonNum - 1}/${sonBolumNo}`;
    }
  }

  const sayfaBasligi = `${dizi.isim} - S${sezonNum}:B${bolumNum} "${aktifBolum.baslik}"`;

  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white lg:flex-row lg:overflow-hidden">
      <IzleNavbar baslik={sayfaBasligi} />

      {/* SOL: PLAYER */}
      <div className="flex w-full flex-col justify-center bg-black lg:h-screen lg:flex-1 lg:p-0">
        <div className="relative flex h-full w-full flex-col">
          <div className="relative flex-1 bg-black">
            <CustomVideoPlayer
              src={aktifBolum.video_url}
              poster={dizi.yan_fotograf} // Dizinin kapağı
              bolumId={aktifBolum.id} // Bölüm ID
              baslangicSaniyesi={baslangicSaniyesi}
            />
          </div>

          {/* Navigasyon Barı */}
          <div className="flex h-16 shrink-0 items-center justify-between border-t border-white/10 bg-[#0a0a0a] px-6">
            <div className="flex-1">
              {oncekiLink ? (
                <Link
                  href={oncekiLink}
                  className="group flex w-max items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  <div className="hidden flex-col sm:flex">
                    <span className="text-[10px] tracking-wider uppercase opacity-60">
                      Önceki
                    </span>
                    <span>Bölüm {bolumNum - 1}</span>
                  </div>
                </Link>
              ) : (
                <div className="w-10" />
              )}
            </div>

            <Link
              href={`/izle/dizi/${diziIdNum}`}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-all hover:border-yellow-500/50 hover:bg-white/10 hover:text-yellow-500"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Bölüm Listesi</span>
            </Link>

            <div className="flex flex-1 justify-end">
              {sonrakiLink ? (
                <Link
                  href={sonrakiLink}
                  className="group flex w-max items-center gap-2 text-right text-sm font-medium text-white transition-colors hover:text-yellow-500"
                >
                  <div className="hidden flex-col sm:flex">
                    <span className="text-[10px] tracking-wider uppercase opacity-60">
                      Sonraki
                    </span>
                    <span>
                      {ayniSezonSonrakiBolum
                        ? `Bölüm ${bolumNum + 1}`
                        : `Sezon ${sezonNum + 1} Bölüm 1`}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <span className="text-sm text-gray-600">Sezon Finali</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ: BÖLÜM YORUMLARI */}
      <div className="flex w-full flex-col border-l border-white/10 bg-[#0a0a0a] pt-0 lg:h-screen lg:w-[450px] lg:shrink-0 lg:pt-20">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-sm font-bold tracking-wider text-gray-200 uppercase">
            Bölüm Yorumları
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-gray-400">Canlı</span>
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          </div>
        </div>

        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 flex-1 overflow-y-auto p-4">
          <YorumlarDizi bolumId={aktifBolum.id} variant="compact" />
        </div>

        <div className="border-t border-white/10 bg-[#0a0a0a] p-3">
          <YorumYapDizi bolumId={aktifBolum.id} variant="compact" />
        </div>
      </div>
    </div>
  );
};

export default Page;
