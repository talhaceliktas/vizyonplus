import type { Movie } from "../../types";
import YakindakiFilm from "./YakindakiFilm";

const YakindakiFilmler = async () => {
  const res = await fetch("https://imdb-top-100-movies.p.rapidapi.com/", {
    method: "GET",
    headers: {
      "x-rapidapi-key": "0a3d8d758emsh2929570012ed1b0p1fe646jsnd500c5e22a12",
      "x-rapidapi-host": "imdb-top-100-movies.p.rapidapi.com",
    },
    next: { revalidate: 86400 },
  });

  const movies = await res.json();

  return (
    <div className="bg-primary-700/15 grid grid-cols-3 gap-x-10 gap-y-20 p-10">
      {movies.map((movie: Movie) => (
        <YakindakiFilm movie={movie} key={movie.imdbid} />
      ))}
    </div>
  );
};

export default YakindakiFilmler;
