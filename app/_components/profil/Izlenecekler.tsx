import Link from "next/link";
import { dahaSonraIzlenecekleriGetir } from "../../_lib/data-service-server";
import KayitliFilm from "./KayitliFilm";
import { FaRegBookmark, FaFilm } from "react-icons/fa6";

const Izlenecekler = async () => {
  const izlenecekler = await dahaSonraIzlenecekleriGetir();

  if (!izlenecekler || izlenecekler.length === 0) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-500/20 blur-xl"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-yellow-500/30 bg-[#121212] shadow-2xl">
            <FaRegBookmark className="text-4xl text-yellow-500" />
          </div>
        </div>

        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-white">Listeniz Henüz Boş</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            İlgini çeken filmleri ve dizileri kaydetmek için içeriklerdeki{" "}
            <FaRegBookmark className="inline text-yellow-500" /> ikonuna
            tıklayabilirsin.
          </p>
        </div>

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
      <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white">İzleme Listem</h1>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-400">
          {izlenecekler.length} İçerik
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {izlenecekler.map((izlenecek) => (
          <KayitliFilm
            key={izlenecek.icerikler_id}
            icerik_id={izlenecek.icerikler_id}
            kayitTuru="dahaSonra"
          />
        ))}
      </div>
    </div>
  );
};

export default Izlenecekler;
