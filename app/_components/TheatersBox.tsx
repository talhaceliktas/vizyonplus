import TheatersSlider from "./TheatersSlider";

const TheatersBox = async () => {
  const res = await fetch("https://imdb-top-100-movies.p.rapidapi.com/", {
    method: "GET",
    headers: {
      "x-rapidapi-key": "b8e9b19f11msh795b95a86cbdd11p1bec82jsn79e995ae5921",
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
