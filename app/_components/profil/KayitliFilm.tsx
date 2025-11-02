import Image from "next/image";
import { filmiGetir } from "../../_lib/data-service-server";
import { IcerikTipi } from "../../types";
import FavorilereEkleButton from "../ui/FavorilereEkleButton";
import Link from "next/link";
import DahaSonraIzleButton from "../ui/DahaSonraIzleButton";

const KayitliFilm = async ({
  icerik_id,
  kayitTuru,
}: {
  icerik_id: number;
  kayitTuru: string;
}) => {
  const film: IcerikTipi = await filmiGetir(icerik_id);

  const { id, isim, fotograf, tur, turler, aciklama } = film;

  const kesilecekKarakter = 125;
  const aciklamaKesilmis =
    aciklama.length > kesilecekKarakter
      ? aciklama.slice(0, kesilecekKarakter)
      : aciklama;

  return (
    <Link
      className="dark:bg-primary-700 bg-primary-800/40 text-primary-50 relative flex aspect-[16/9] w-full gap-x-2 overflow-hidden rounded-xl duration-300"
      href={
        tur === "film" ? `/icerikler/filmler/${id}` : `/icerikler/diziler/${id}`
      }
    >
      <div className="relative aspect-[9/16] h-full">
        <Image
          alt={`${isim} filmi`}
          src={fotograf}
          fill
          className="object-cover"
          sizes="100%"
        />
      </div>

      <div className="flex flex-col gap-y-2 p-4">
        <h1 className="text-2xl font-semibold">{isim}</h1>

        <p className="text-sm opacity-70">
          {turler.map((tur, index) => (
            <span key={tur}>
              {index !== 0 && " | "}
              {tur}
            </span>
          ))}
        </p>

        <p className="mt-4 text-base">{aciklamaKesilmis}...</p>

        <div className="absolute right-4 bottom-4 flex gap-x-2">
          {kayitTuru === "favori" ? (
            <FavorilereEkleButton icerik_id={id} />
          ) : (
            <DahaSonraIzleButton icerik_id={id} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default KayitliFilm;
