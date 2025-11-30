import supabaseServer from "../../../_lib/supabase/server";
import { filmiGetir } from "../../../_lib/data-service-server";
import { FilmDetay } from "../../../types";
import Yorumlar from "../../../_components/icerikler/dizi-film/Yorumlar";
import YorumYap from "../../../_components/icerikler/dizi-film/YorumYap";
import CustomVideoPlayer from "../../../_components/izle/CustomVideoPlayer";
import IzleNavbar from "../../../_components/izle/IzleNavbar";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { filmId: string } }) => {
  const { filmId } = await params;
  const filmIdNumber = Number(filmId);

  const film: FilmDetay = await filmiGetir(filmIdNumber);

  if (!film || !film.video_url) {
    notFound();
  }

  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let baslangicSaniyesi = 0;

  if (user) {
    const { data: izlemeKaydi } = await supabase
      .from("izleme_gecmisi")
      .select("kalinan_saniye")
      .eq("kullanici_id", user.id)
      .eq("film_id", filmIdNumber)
      .single();

    if (izlemeKaydi) {
      baslangicSaniyesi = izlemeKaydi.kalinan_saniye;
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white lg:flex-row lg:overflow-hidden">
      {/* --- ÖZEL İZLEME NAVBARI --- */}
      <IzleNavbar baslik={film.isim} />

      {/* --- SOL TARAFI: VİDEO PLAYER --- */}
      <div className="flex w-full flex-col justify-center bg-black lg:h-screen lg:flex-1 lg:p-0">
        <div className="relative h-full w-full">
          <CustomVideoPlayer
            src={film.video_url} // Gerçek Video URL
            poster={film.yan_fotograf} // Gerçek Kapak Resmi
            filmId={filmIdNumber} // Kayıt için ID
            baslangicSaniyesi={baslangicSaniyesi} // Kaldığı yer
          />
        </div>
      </div>

      {/* --- SAĞ TARAFI: YORUMLAR --- */}
      <div className="flex w-full flex-col border-l border-white/10 bg-[#0a0a0a] pt-20 lg:h-screen lg:w-[450px] lg:shrink-0 lg:pt-20">
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-sm font-bold tracking-wider text-gray-200 uppercase">
            Yorumlar
          </h2>
          {/* Canlı İkonu */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-gray-400">
              Sohbet
            </span>
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          </div>
        </div>

        {/* Yorum Listesi */}
        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 flex-1 overflow-y-auto p-4">
          <Yorumlar icerikId={filmIdNumber} variant="compact" />
        </div>

        {/* Yorum Yapma */}
        <div className="border-t border-white/10 bg-[#0a0a0a] p-3">
          <YorumYap icerikId={filmIdNumber} variant="compact" />
        </div>
      </div>
    </div>
  );
};

export default Page;
