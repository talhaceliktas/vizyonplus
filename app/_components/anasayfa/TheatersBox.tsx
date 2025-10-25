import TheatersSlider from "./TheatersSlider";

const TheatersBox = async () => {
  const res = await fetch("https://imdb-top-100-movies.p.rapidapi.com/", {
    method: "GET",
    headers: {
      "x-rapidapi-key": "0a3d8d758emsh2929570012ed1b0p1fe646jsnd500c5e22a12",
      "x-rapidapi-host": "imdb-top-100-movies.p.rapidapi.com",
    },
    next: { revalidate: 86400 },
  });

  const movies = await res.json();

  const topTenMovies = movies.slice(0, 10);

  return (
    <div className="p-4">
      <TheatersSlider movies={topTenMovies} />
    </div>
  );
};

export default TheatersBox;
