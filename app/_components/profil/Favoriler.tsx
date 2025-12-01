import Link from "next/link";
import { favorileriGetir } from "../../_lib/data-service-server";
import KayitliFilm from "./KayitliFilm";
import { FaHeart, FaFilm } from "react-icons/fa6";

const Favoriler = async () => {
  const favoriler = await favorileriGetir();

  if (!favoriler || favoriler.length === 0) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/20 blur-xl"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-red-500/30 bg-[#121212] shadow-2xl">
            <FaHeart className="text-4xl text-red-500" />
          </div>
        </div>

        {/* Metin */}
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-white">Favori Listeniz Boş</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Beğendiğin filmleri ve dizileri{" "}
            <FaHeart className="inline text-red-500" /> ikonuna tıklayarak
            koleksiyonuna ekle.
          </p>
        </div>

        {/* Aksiyon Butonu */}
        <Link
          href="/icerikler"
          className="group flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-black transition-all hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95"
        >
          <FaFilm />
          <span>İçerikleri Keşfet</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Başlık Alanı */}
      <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white">Favorilerim</h1>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-400">
          {favoriler.length} İçerik
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {favoriler.map((favori) => (
          <KayitliFilm
            key={favori.icerikler_id}
            icerik_id={favori.icerikler_id}
            kayitTuru="favori"
          />
        ))}
      </div>
    </div>
  );
};

export default Favoriler;
