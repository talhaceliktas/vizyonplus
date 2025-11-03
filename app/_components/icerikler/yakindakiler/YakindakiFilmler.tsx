import type { Movie } from "../../../types";
import YakindakiFilm from "./YakindakiFilm";

const YakindakiFilmler = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/movies`, {
    next: { revalidate: 86400 },
  });
  const movies = await res.json();

  return (
    <div className="bg-primary-700/15 grid gap-x-10 gap-y-20 p-10 md:grid-cols-2 lg:grid-cols-3">
      {movies.map((movie: Movie) => (
        <YakindakiFilm movie={movie} key={movie.imdbid} />
      ))}
    </div>
  );
};

export default YakindakiFilmler;
