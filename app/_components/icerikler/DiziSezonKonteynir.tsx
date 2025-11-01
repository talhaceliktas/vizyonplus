"use client";

import { useState } from "react";
import DiziBolumleri from "./DiziBolumleri";
import DiziSezonlari from "./DiziSezonlari";

const DiziSezonKonteynir = ({ dizi }) => {
  const [seciliSezon, setSeciliSezon] = useState(1);

  return (
    <div className="divide-primary-500 border-primary-600 flex border-[1px]">
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
