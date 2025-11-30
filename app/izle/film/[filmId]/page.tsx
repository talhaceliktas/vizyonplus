import Yorumlar from "../../../_components/icerikler/dizi-film/Yorumlar";
import YorumYap from "../../../_components/icerikler/dizi-film/YorumYap";
import CustomVideoPlayer from "../../../_components/izle/CustomVideoPlayer"; // Native Player

// Test URL'si (Tears of Steel - Hızlı Yüklenir)
const TEST_VIDEO_URL =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
const TEST_POSTER =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg";

const Page = async ({ params }: { params: { filmId: string } }) => {
  const { filmId } = await params;

  return (
    // Ana Kapsayıcı: Tam ekran yüksekliği (h-screen), arka plan siyah
    <div className="flex min-h-screen flex-col bg-black pt-20 text-white lg:flex-row lg:overflow-hidden lg:pt-0">
      {/* --- SOL TARAFI: VİDEO PLAYER --- */}
      {/* Masaüstünde: Geniş alan (flex-1), kaydırma yok */}
      <div className="flex w-full flex-col justify-center bg-black lg:h-screen lg:flex-1 lg:p-6">
        <div className="mx-auto w-full max-w-7xl">
          {/* Video Player Bileşeni */}
          <CustomVideoPlayer
            src={TEST_VIDEO_URL}
            poster={TEST_POSTER}
            // baslangicSaniyesi={120} // Test için
          />

          {/* Video Altı Bilgiler (Opsiyonel) */}
          <div className="mt-4 hidden px-2 lg:block">
            <h1 className="text-2xl font-bold text-white">Tears of Steel</h1>
            <p className="text-gray-400">Bilim Kurgu • 2012</p>
          </div>
        </div>
      </div>

      {/* --- SAĞ TARAFI: YORUMLAR --- */}
      {/* Masaüstünde: Sabit genişlik (w-96 veya w-[400px]), sağ tarafta, kendi içinde scroll olur */}
      <div className="flex w-full flex-col border-l border-white/10 bg-[#0a0a0a] lg:h-screen lg:w-[450px] lg:shrink-0">
        {/* Yorumlar Başlığı (Sabit) */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="text-lg font-bold">Yorumlar</h2>
        </div>

        {/* Yorum Listesi (Scroll Edilebilir Alan) */}
        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 flex-1 overflow-y-auto p-4">
          <Yorumlar icerikId={Number(filmId)} variant="compact" />
          <YorumYap icerikId={Number(filmId)} variant="compact" />
        </div>
      </div>
    </div>
  );
};

export default Page;
