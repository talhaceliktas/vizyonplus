import Image from "next/image";
import { FilmTipi } from "../../types";
import { randomDatePrevious30Days } from "../../_helper/rastgeleTarih";

const Film = ({ film }: { film: FilmTipi }) => {
  return (
    <div className="flex flex-col gap-y-4 overflow-hidden rounded-lg">
      <div className="relative aspect-[619/919] w-full">
        <Image
          src={film.fotograf}
          alt={`${film.isim} Filmi`}
          fill
          className="object-contain opacity-85"
          loading="lazy"
        />
      </div>

      <h2 className="text-center text-2xl font-semibold">{film.isim}</h2>
      <div className="text-primary-50 flex flex-col text-center">
        {/* <p className="opacity-75">
          {movie.genre.map((tur, index) => (
            <span key={tur}>
              {index !== 0 && "| "}
              {tur}{" "}
            </span>
          ))}
        </p> */}
        <p className="gap-x-4 text-lg">
          <span className="opacity-80">Vizyon Tarihi: </span>
          <span className="font-bold opacity-90">
            {randomDatePrevious30Days()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Film;
