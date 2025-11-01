import Image from "next/image";
import { FilmDetay } from "../../../types";
import Link from "next/link";

const Film = ({ film }: { film: FilmDetay }) => {
  return (
    <Link
      className="flex flex-col gap-y-2 overflow-hidden rounded-lg grayscale-25 duration-300 hover:scale-110 hover:grayscale-0"
      href={`/icerikler/filmler/${film.id}`}
    >
      <div className="relative aspect-[619/919] w-full">
        <Image
          src={film.fotograf}
          alt={`${film.isim} Filmi`}
          fill
          className="object-contain opacity-85"
          loading="lazy"
          sizes="100%"
        />
      </div>
      <h2 className="text-secondary-1-2 text-center text-xl font-semibold">
        {film.isim}
      </h2>
      <div className="text-primary-50 flex flex-col text-center">
        <p className="opacity-75">
          {film.turler.map((tur, index) => (
            <span key={tur}>
              {index !== 0 && "| "}
              {tur}{" "}
            </span>
          ))}
        </p>
      </div>
      {film.film_ucretleri[0].indirim_orani ? (
        <div className="flex justify-center gap-x-6 opacity-90">
          <span className="line-through opacity-70">
            {film.film_ucretleri[0].satin_alma_ucreti} TL
          </span>
          <span>
            {(
              (film.film_ucretleri[0].satin_alma_ucreti / 100) *
              (100 - film.film_ucretleri[0].indirim_orani)
            ).toFixed(2)}{" "}
            TL
          </span>
        </div>
      ) : (
        <p className="text-center opacity-95">
          {film.film_ucretleri[0].satin_alma_ucreti} TL
        </p>
      )}
    </Link>
  );
};

export default Film;
