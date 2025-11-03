"use client";

import { DiziDetay } from "../../types";

const DiziBolumleri = ({
  diziSezonBilgileri,
  seciliSezon,
}: {
  diziSezonBilgileri: DiziDetay["dizi"];
  seciliSezon: number;
}) => {
  const seciliSezonBolumleri = diziSezonBilgileri?.find(
    (s) => s.sezon_numarasi === seciliSezon,
  );

  return (
    <div className="flex flex-1 flex-col">
      <table className="table-auto border-collapse">
        <thead>
          {seciliSezonBolumleri?.bolumler.map((bolum) => (
            <tr
              key={bolum.id}
              className="hover:bg-primary-800 dark:hover:bg-primary-700 cursor-pointer duration-300"
            >
              <td className="text-primary-400 p-2 text-xs sm:text-base">
                Bölüm {bolum.bolum_numarasi}
              </td>
              <td className="text-sm md:text-base">{bolum.baslik}</td>
              <td className="text-primary-400 pr-4 text-end text-xs md:text-base">
                {new Date(bolum.yayin_tarihi).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
};

export default DiziBolumleri;
