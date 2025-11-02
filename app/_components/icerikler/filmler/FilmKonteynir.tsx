"use client";

import { useSearchParams } from "next/navigation";
import { FilmDetay } from "../../../types";
import Film from "./Film";
import { useEffect, useState } from "react";
import filmleriSiralaVeFiltrele from "../../../_helper/filmleriSiralaVeFiltrele";

const FilmKonteynir = ({ filmler }: { filmler: FilmDetay[] }) => {
  const [filtreler, setFiltreler] = useState<string[]>([]);
  const [siralama, setSiralama] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const turParams = searchParams.get("tur");
    const siralamaParam = searchParams.get("siralama");
    let turler: string[] = [];

    if (turParams) {
      turler = turParams.split(",");
    }

    setFiltreler(turler);
    setSiralama(siralamaParam || "alfabetikAZ");
  }, [searchParams]);

  const gosterilecekFilmler = filmleriSiralaVeFiltrele(
    filtreler,
    filmler,
    siralama,
  );

  return (
    <div className="dark:bg-primary-700/15 bg-primary-800/50 grid grid-cols-3 gap-x-10 gap-y-20 rounded-xl p-10">
      {gosterilecekFilmler.map((film: FilmDetay) => (
        <Film film={film} key={film.id} />
      ))}
    </div>
  );
};

export default FilmKonteynir;
