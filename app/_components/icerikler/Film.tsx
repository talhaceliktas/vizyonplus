import Image from "next/image";
import { FilmTipi } from "../../types";
import Link from "next/link";

const Film = ({ film }: { film: FilmTipi }) => {
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
        />
      </div>

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
      <h2 className="text-center text-xl font-semibold">{film.isim}</h2>
    </Link>
  );
};

export default Film;
