import ImdbHundered from "./ImdbHundered";
import UpcomingMovies from "./UpcomingMovies";

const CategoriContent = ({ katalog }: { katalog: string }) => {
  return (
    <div>
      {katalog === "vizyondakiler" && <div></div>}
      {katalog === "yakindakiler" && <UpcomingMovies />}
      {katalog === "imdb" && <ImdbHundered />}
    </div>
  );
};

export default CategoriContent;
