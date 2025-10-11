import Image from "next/image";
import { Movie } from "../types";
import { randomDateNext30Days } from "../_helper/randomDate";

const UpcomingMovie = ({ movie }: { movie: Movie }) => {
  return (
    <div className="flex flex-col gap-y-4 overflow-hidden rounded-lg">
      <div className="relative aspect-[619/919] w-full">
        <Image
          src={movie.big_image}
          alt={`${movie.title} Filmi`}
          fill
          className="object-contain opacity-85"
          loading="lazy"
        />
      </div>

      <h2 className="text-center text-2xl font-semibold">{movie.title}</h2>
      <div className="text-primary-50 flex flex-col text-center">
        <p className="opacity-75">
          {movie.genre.map((tur, index) => (
            <span key={tur}>
              {index !== 0 && "| "}
              {tur}{" "}
            </span>
          ))}
        </p>
        <p className="gap-x-4 text-lg">
          <span className="opacity-80">Vizyon Tarihi: </span>
          <span className="text-primary-50 font-bold opacity-90">
            {randomDateNext30Days()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default UpcomingMovie;
