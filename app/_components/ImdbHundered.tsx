import type { Movie } from "../types";
import ImdbMovie from "./imdbMovie";

const ImdbHundered = async () => {
  const res = await fetch("https://imdb-top-100-movies.p.rapidapi.com/", {
    method: "GET",
    headers: {
      "x-rapidapi-key": "b8e9b19f11msh795b95a86cbdd11p1bec82jsn79e995ae5921",
      "x-rapidapi-host": "imdb-top-100-movies.p.rapidapi.com",
    },
    next: { revalidate: 86400 },
  });

  const movies = await res.json();

  return (
    <div className="bg-primary-700/15 grid grid-cols-3 gap-x-10 gap-y-20 p-10">
      {movies.map((movie: Movie) => (
        <ImdbMovie movie={movie} key={movie.imdbid} />
      ))}
    </div>
  );
};

export default ImdbHundered;
