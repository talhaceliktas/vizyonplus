import { filmleriGetir } from "../../_lib/data-service";
import type { FilmTipi } from "../../types";
import Film from "./Film";

const Filmler = async () => {
  const filmler = await filmleriGetir();

  return (
    <div className="bg-primary-700/15 grid grid-cols-3 gap-x-10 gap-y-20 p-10">
      {filmler.map((film: FilmTipi) => (
        <Film film={film} key={film.id} />
      ))}
    </div>
  );
};

export default Filmler;
