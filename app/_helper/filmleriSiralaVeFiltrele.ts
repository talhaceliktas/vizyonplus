import { FilmDetay } from "../types";

export default function filmleriSiralaVeFiltrele(
  filtreler: string[],
  filmler: FilmDetay[],
  siralama: string,
) {
  let ayarlanmisFilmler = [...filmler];

  if (filtreler && filtreler.length > 0) {
    ayarlanmisFilmler = filmler.filter((film: FilmDetay) =>
      film.turler.some((filmTuru) => filtreler.includes(filmTuru)),
    );
  }

  if (siralama === "alfabetikAZ") {
    ayarlanmisFilmler.sort((a, b) => a.isim.localeCompare(b.isim));
  } else if (siralama === "alfabetikZA") {
    ayarlanmisFilmler.sort((a, b) => b.isim.localeCompare(a.isim));
  } else if (siralama === "fiyataGoreArtan") {
    ayarlanmisFilmler.sort(
      (a, b) =>
        (a.film_ucretleri[0].satin_alma_ucreti *
          (100 - a.film_ucretleri[0].indirim_orani)) /
          100 -
        (b.film_ucretleri[0].satin_alma_ucreti *
          (100 - b.film_ucretleri[0].indirim_orani)) /
          100,
    );
  } else if (siralama === "fiyataGoreAzalan") {
    ayarlanmisFilmler.sort(
      (a, b) =>
        (b.film_ucretleri[0].satin_alma_ucreti *
          (100 - b.film_ucretleri[0].indirim_orani)) /
          100 -
        (a.film_ucretleri[0].satin_alma_ucreti *
          (100 - a.film_ucretleri[0].indirim_orani)) /
          100,
    );
  }

  return ayarlanmisFilmler;
}
