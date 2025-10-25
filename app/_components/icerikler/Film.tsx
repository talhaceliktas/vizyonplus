import Image from "next/image";
import { FilmTipi } from "../../types";

const Film = ({ film }: { film: FilmTipi }) => {
  return (
    <div className="flex flex-col gap-y-2 overflow-hidden rounded-lg">
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
    </div>
  );
};

export default Film;
