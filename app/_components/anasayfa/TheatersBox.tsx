import TheatersSlider from "./TheatersSlider";

const TheatersBox = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/movies`, {
    next: { revalidate: 86400 },
  });
  const movies = await res.json();

  return (
    <div className="p-4">
      <TheatersSlider movies={movies} />
    </div>
  );
};

export default TheatersBox;
