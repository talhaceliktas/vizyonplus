"use client";

import { useState } from "react";
import DiziBolumleri from "./DiziBolumleri";
import DiziSezonlari from "./DiziSezonlari";
import { DiziDetay } from "../../../types";
import AboneOlKarti from "./AboneOlKarti"; // Yeni kartı import et

// Prop tipine aboneMi eklendi
const DiziSezonKonteynir = ({
  dizi,
  aboneMi,
}: {
  dizi: DiziDetay;
  aboneMi: boolean;
}) => {
  const [seciliSezon, setSeciliSezon] = useState<number>(1);

  if (!aboneMi) {
    return <AboneOlKarti />;
  }

  return (
    <div className="divide-primary-500 border-primary-600 flex flex-col border-[1px] md:flex-row">
      <DiziSezonlari
        diziSezonBilgileri={dizi.dizi}
        seciliSezon={seciliSezon}
        setSeciliSezon={setSeciliSezon}
      />
      <span className="bg-primary-600 h-px w-full md:h-auto md:w-[1px]"></span>
      <DiziBolumleri
        diziSezonBilgileri={dizi.dizi}
        seciliSezon={seciliSezon}
        diziId={dizi.id}
      />
    </div>
  );
};

export default DiziSezonKonteynir;
