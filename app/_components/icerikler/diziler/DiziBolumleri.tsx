"use client";

import Link from "next/link";
import { DiziDetay } from "../../../types";
import toast from "react-hot-toast";

const DiziBolumleri = ({
  diziSezonBilgileri,
  seciliSezon,
  diziId,
}: {
  diziSezonBilgileri: DiziDetay["dizi"];
  seciliSezon: number;
  diziId: number;
}) => {
  const seciliSezonBolumleri = diziSezonBilgileri?.find(
    (s) => s.sezon_numarasi === seciliSezon,
  );

  const onClick = () => {
    toast.success("İyi seyirler! Player açılıyor...");
  };

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="flex w-full flex-col">
        {seciliSezonBolumleri?.bolumler.map((bolum) => (
          <Link
            key={bolum.id}
            href={`/izle/dizi/${diziId}/${seciliSezon}/${bolum.id}`}
            className="hover:bg-primary-800 dark:hover:bg-primary-700 flex w-full items-center justify-between border-b border-white/5 py-2 transition-colors duration-300"
            onClick={onClick}
          >
            <div className="text-primary-400 w-[20%] min-w-[80px] p-2 text-xs sm:text-base">
              Bölüm {bolum.bolum_numarasi}
            </div>

            <div className="flex-1 px-2 text-sm md:text-base">
              {bolum.baslik}
            </div>

            <div className="text-primary-400 w-[30%] min-w-[100px] pr-4 text-end text-xs md:text-base">
              {new Date(bolum.yayin_tarihi).toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DiziBolumleri;
