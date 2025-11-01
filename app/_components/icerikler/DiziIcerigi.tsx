import React from "react";
import { LuTimer } from "react-icons/lu";
import { MdDateRange } from "react-icons/md";
import { DiziDetay } from "../../types";

const DiziIcerigi = ({ dizi }: { dizi: DiziDetay }) => {
  const { isim, yonetmen, yayinlanma_tarihi, turler, sure, aciklama } = dizi;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-6xl">
          {isim}{" "}
          <span className="text-2xl italic opacity-50">/ {yonetmen}</span>
        </h1>
      </div>
      <div className="flex justify-between text-xl opacity-75">
        <div className="flex items-center gap-x-10">
          <h3 className="flex items-center gap-x-2">
            <MdDateRange className="h-[30px] w-[30px]" />
            {yayinlanma_tarihi}
          </h3>
          <h3 className="flex items-center gap-x-2">
            <LuTimer className="h-[28px] w-[28px]" />
            Ortalama Bölüm Süresi: &nbsp;
            {Math.floor(sure / 60) !== 0 && `${Math.floor(sure / 60)}s`}{" "}
            {sure % 60}dk
          </h3>
        </div>
        <h3>
          {turler.map((tur, index) => (
            <span key={tur}>
              {index !== 0 && "| "}
              {tur}{" "}
            </span>
          ))}
        </h3>
      </div>
      <p className="text-lg">{aciklama}</p>
    </>
  );
};

export default DiziIcerigi;
