import TheatersSlider from "./TheatersSlider";

const TheatersBox = async () => {
  const res = await fetch("https://imdb-top-100-movies.p.rapidapi.com/", {
    method: "GET",
    headers: {
      "x-rapidapi-key": "672f6168b4msh7b05ab981751e6ap1a90edjsnc0be08884a63",
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
