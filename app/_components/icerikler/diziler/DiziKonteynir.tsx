"use client";

import { useSearchParams } from "next/navigation";
import { DiziDetay } from "../../../types";
import { useEffect, useState } from "react";
import Dizi from "./Dizi";
import dizileriSiralaVeFiltrele from "../../../_helper/dizileriSiralaVeFiltrele";

const DiziKonteynir = ({ diziler }: { diziler: DiziDetay[] }) => {
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

  const gosterilecekDiziler = dizileriSiralaVeFiltrele(
    filtreler,
    diziler,
    siralama,
  );

  return (
    <div className="dark:bg-primary-700/15 bg-primary-800/50 grid grid-cols-3 gap-x-10 gap-y-20 rounded-xl p-10">
      {gosterilecekDiziler.map((dizi: DiziDetay) => (
        <Dizi dizi={dizi} key={dizi.id} />
      ))}
    </div>
  );
};

export default DiziKonteynir;
