"use client";

import { DiziDetay } from "../../types";

const DiziSezonlari = ({
  diziSezonBilgileri,
  seciliSezon,
  setSeciliSezon,
}: {
  diziSezonBilgileri: DiziDetay["dizi"];
  seciliSezon: number;
  setSeciliSezon: React.Dispatch<React.SetStateAction<number>>;
}) => {
  if (!diziSezonBilgileri || diziSezonBilgileri.length === 0) return null;

  console.log(seciliSezon);

  return (
    <div className="flex flex-col">
      {diziSezonBilgileri.map((sezon) => (
        <button
          key={sezon.sezon_numarasi}
          onClick={() => setSeciliSezon(sezon.sezon_numarasi)}
          className={`cursor-pointer px-4 py-3 text-left text-base duration-300 md:text-lg ${sezon.sezon_numarasi === seciliSezon ? "dark:bg-primary-600 bg-primary-800 opacity-100" : "hover:bg-primary-600/50 opacity-65"}`}
        >
          SEZON {sezon.sezon_numarasi}
        </button>
      ))}
    </div>
  );
};

export default DiziSezonlari;
