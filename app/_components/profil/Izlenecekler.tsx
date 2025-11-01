import Link from "next/link";
import { dahaSonraIzlenecekleriGetir } from "../../_lib/data-service-server";
import KayitliFilm from "./KayitliFilm";
import { FaRegBookmark } from "react-icons/fa6";

const Izlenecekler = async () => {
  const izlenecekler = await dahaSonraIzlenecekleriGetir();

  if (!izlenecekler || izlenecekler.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full text-center gap-4">
        <Link
          href="/icerikler"
          className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-full"
        >
          <FaRegBookmark className="text-blue-500 text-4xl" />
        </Link>

        <h2 className="text-xl font-semibold text-secondary-1-2">
          Daha Sonra İzle listende henüz film yok
        </h2>
        <p className="text-secondary-3 text-sm flex items-center justify-center gap-1">
          İzlemek istediğin filmleri <FaRegBookmark className="text-xl" /> ikonuna tıklayarak buraya ekleyebilirsin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid h-full w-full grid-cols-2 gap-x-10 gap-y-16">
      {izlenecekler.map((izlenecek) => (
        <KayitliFilm
          key={izlenecek.icerikler_id}
          icerik_id={izlenecek.icerikler_id}
          kayitTuru="dahaSonra"
        />
      ))}
    </div>
  );
};

export default Izlenecekler;
