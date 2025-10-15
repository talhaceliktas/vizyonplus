import Image from "next/image";
import { Movie } from "../types";
import { playwrite } from "../_lib/fonts";
import { LiaImdb } from "react-icons/lia";

const ImdbMovie = ({ movie }: { movie: Movie }) => {
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
        <div
          className={`bg-primary-900 absolute top-0 right-0 rounded-bl-2xl p-3 text-center text-xl ${playwrite.className}`}
        >
          #{movie.rank}
        </div>
      </div>

      <h2 className="text-center text-2xl font-semibold">{movie.title}</h2>
      <div className="text-primary-50 flex flex-col text-center">
        <p className="opacity-85">
          {movie.genre.map((tur, index) => (
            <span key={tur}>
              {index !== 0 && "| "}
              {tur}{" "}
            </span>
          ))}
        </p>
        <div className="flex items-center justify-center gap-x-4 text-3xl opacity-90">
          <LiaImdb fill="var(--color-secondary-1)" />{" "}
          <span className="text-2xl">{movie.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default ImdbMovie;
