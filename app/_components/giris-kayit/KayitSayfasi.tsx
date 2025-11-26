"use client";

import { useState } from "react";
import KayitOl from "./KayitOl";
import KayitTamamlandi from "./KayitTamamlandi";
import { openSans } from "../../_lib/fontlar";

const KayitSayfasi = () => {
  const [kayitTamamlandi, setKayitTamamlandi] = useState(false);
  const [gonderilenEmail, setGonderilenEmail] = useState("");

  return (
    <div className="h-screen w-full">
      <div className="dis-kutu h-full w-full rounded-2xl bg-gray-50">
        <div
          className={`flex h-full w-full flex-col items-center justify-center gap-y-3 bg-cover bg-center p-5 ${openSans.className} `}
          style={{ backgroundImage: "url('/loginBG.webp')" }}
        >
          {kayitTamamlandi ? (
            <KayitTamamlandi gonderilenEmail={gonderilenEmail} />
          ) : (
            <KayitOl
              setKayitTamamlandi={setKayitTamamlandi}
              setGonderilenEmail={setGonderilenEmail}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default KayitSayfasi;
