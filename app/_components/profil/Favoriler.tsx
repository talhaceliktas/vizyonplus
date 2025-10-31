import { favorileriGetir } from "../../_lib/data-service-server";
import KayitliFilm from "./KayitliFilm";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";

const Favoriler = async () => {
  const favoriler = await favorileriGetir();

  if (!favoriler || favoriler.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full text-center gap-4">
        <Link
          href="/icerikler"
          className="flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-full"
        >
          <FaHeart className="text-pink-500 text-4xl" />
        </Link>

        <h2 className="text-xl font-semibold text-secondary-1-2">
          Henüz favori bir filmin yok
        </h2>
        <p className="text-secondary-3 text-sm max-w-sm">
          Beğendiğin filmleri kalp ikonuna tıklayarak buraya ekleyebilirsin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid h-full w-full grid-cols-2 gap-x-10 gap-y-16">
      {favoriler.map((favori) => (
        <KayitliFilm
          key={favori.icerikler_id}
          icerik_id={favori.icerikler_id}
          kayitTuru="favori"
        />
      ))}
    </div>
  );
};

export default Favoriler;
