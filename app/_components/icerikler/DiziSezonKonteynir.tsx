"use client";

import { useState } from "react";
import DiziBolumleri from "./DiziBolumleri";
import DiziSezonlari from "./DiziSezonlari";
import { DiziDetay } from "../../types";

const DiziSezonKonteynir = ({ dizi }: { dizi: DiziDetay }) => {
  const [seciliSezon, setSeciliSezon] = useState<number>(1);

  return (
    <div className="divide-primary-500 border-primary-600 flex flex-col border-[1px] md:flex-row">
      <DiziSezonlari
        diziSezonBilgileri={dizi.dizi}
        seciliSezon={seciliSezon}
        setSeciliSezon={setSeciliSezon}
      />
      <span className="bg-primary-600 h-full w-[1px]"></span>
      <DiziBolumleri diziSezonBilgileri={dizi.dizi} seciliSezon={seciliSezon} />
    </div>
  );
};

export default DiziSezonKonteynir;
