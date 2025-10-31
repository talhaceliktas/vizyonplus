"use client";

import Image from "next/image";
import { YorumTipi } from "../../../types";
import { useState } from "react";

const SpoilerYorum = ({ yorum }: { yorum: YorumTipi }) => {
  const [spoilerAcildi, setSpoilerAcildi] = useState(false);

  return (
    <div className="relative" onClick={() => setSpoilerAcildi(true)}>
      <div
        className={`flex w-full gap-x-4 pb-4 duration-500 ${spoilerAcildi ? "blur-none" : "cursor-pointer blur-md"}`}
      >
        <div className="relative h-16 w-16">
          <Image
            alt={`${yorum.profiller.isim} profil fotografi`}
            src={yorum.profiller.profil_fotografi || "/default-user.jpg"}
            className="rounded-full"
            fill
          />
        </div>
        <div className="w-full">
          <h2 className="text-secondary-1 text-xl font-semibold">
            {yorum.profiller.isim}
          </h2>
          <p className="text-primary-100">{yorum.yorum}</p>
          <p className="w-full text-end">
            {new Date(yorum.olusturulma_zamani)
              .toLocaleDateString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })
              .replaceAll(".", "/")}
          </p>
        </div>
      </div>
      <h3
        className={`text-secondary-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-xl ${spoilerAcildi && "invisible"}`}
      >
        Spoilerı görmek için tıkla!
      </h3>
    </div>
  );
};

export default SpoilerYorum;
