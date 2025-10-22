import type { Movie } from "../../types";
import Film from "./Film";

const Filmler = async () => {
  const res = await fetch("https://imdb-top-100-movies.p.rapidapi.com/", {
    method: "GET",
    headers: {
      "x-rapidapi-key": "672f6168b4msh7b05ab981751e6ap1a90edjsnc0be08884a63",
      "x-rapidapi-host": "imdb-top-100-movies.p.rapidapi.com",
    },
    next: { revalidate: 86400 },
  });

  const movies = await res.json();

  return (
    <div className="bg-primary-700/15 grid grid-cols-3 gap-x-10 gap-y-20 p-10">
      {movies.map((movie: Movie) => (
        <Film movie={movie} key={movie.imdbid} />
      ))}
    </div>
  );
};

export default Filmler;
