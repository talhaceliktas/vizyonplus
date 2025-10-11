import ImdbHundered from "./ImdbHundered";
import TheatersMovies from "./TheatersMovies";
import UpcomingMovies from "./UpcomingMovies";

const CategoryContent = ({ katalog }: { katalog: string }) => {
  return (
    <div>
      {katalog === "vizyondakiler" && <TheatersMovies />}
      {katalog === "yakindakiler" && <UpcomingMovies />}
      {katalog === "imdb" && <ImdbHundered />}
    </div>
  );
};

export default CategoryContent;
