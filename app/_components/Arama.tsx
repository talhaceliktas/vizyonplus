import { useEffect, useRef, useState } from "react";
import { aramaYap } from "../_lib/data-service-client";
import Image from "next/image";
import useDisariTiklamaAlgila from "../hooks/useDisariTiklamaAlgila";

interface VeriTipi {
  id: string | number;
  fotograf: string;
  isim?: string;
  aciklama?: string;
  tur?: string;
}

const Arama = () => {
  const [arama, setArama] = useState("");
  const [veriler, setVeriler] = useState<VeriTipi[]>([]);

  const aramaRef = useRef(null);

  const { isOpen, setIsOpen } = useDisariTiklamaAlgila(aramaRef);

  useEffect(() => {
    if (arama.length >= 2) {
      const aramaYapiliyor = async () => {
        try {
          const gelenVeriler = await aramaYap(arama);
          // array değilse boş array ata
          setVeriler(Array.isArray(gelenVeriler) ? gelenVeriler : []);
          console.log(gelenVeriler);
        } catch (err) {
          console.error("Arama hatası:", err);
          setVeriler([]);
        }
      };
      aramaYapiliyor();
    } else {
      setVeriler([]);
    }
  }, [arama]);

  return (
    <div className="relative">
      <input
        type="text"
        className="bg-primary-50 placeholder:text-primary-500 text-primary-900 w-[15rem] rounded-full p-1 pl-3 duration-300 focus:w-[20rem]"
        placeholder="Ara..."
        onChange={(e) => setArama(e.target.value)}
        value={arama}
        onClick={() => setIsOpen(true)}
      />

      {veriler.length > 0 && isOpen && (
        <div
          className="bg-primary-900 absolute top-12 z-50 grid w-[200%] -translate-x-1/4 grid-cols-2 gap-4 rounded-lg p-4 shadow-lg"
          ref={aramaRef}
        >
          {veriler.map((veri) => (
            <div
              className="bg-primary-800 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-xl p-2"
              key={veri.id}
            >
              {veri.fotograf && (
                <div className="relative h-28 w-16">
                  <Image
                    alt={veri.isim || "Görsel"}
                    src={veri.fotograf}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-secondary-1 font-semibold">
                    {veri.isim ? (
                      <>
                        {veri.isim
                          .split(new RegExp(`(${arama})`, "gi"))
                          .map((parca, i) =>
                            parca.toLowerCase() === arama.toLowerCase() ? (
                              <span
                                key={i}
                                className="bg-blue-800 font-bold text-white"
                              >
                                {parca}
                              </span>
                            ) : (
                              <span key={i}>{parca}</span>
                            ),
                          )}
                      </>
                    ) : null}
                  </h2>
                  <p className="text-sm font-normal opacity-70">
                    {veri.aciklama.slice(0, 75)}...
                  </p>
                </div>
                <p className="text-secondary-2 text-end text-sm font-normal">
                  {veri.tur === "film" ? "Film" : "Dizi"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Arama;
