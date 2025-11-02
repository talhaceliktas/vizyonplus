"use client"; // <-- "use client" zaten vardı, en üste taşıdım

import { useEffect, useRef, useState } from "react";
import { aramaYap } from "../_lib/data-service-client";
import Image from "next/image";
import useDisariTiklamaAlgila from "../hooks/useDisariTiklamaAlgila";
import Link from "next/link";

interface VeriTipi {
  id: string | number;
  fotograf: string;
  isim?: string;
  aciklama?: string;
  tur?: string;
}

// --- 1. Mobil görünümü takip etmek için state ---
const Arama = () => {
  const [arama, setArama] = useState("");
  const [veriler, setVeriler] = useState<VeriTipi[]>([]);
  const [isMobileView, setIsMobileView] = useState(false); // <-- EKLENDİ

  const aramaRef = useRef(null);
  const { isOpen, setIsOpen } = useDisariTiklamaAlgila(aramaRef); // --- 2. Ekran genişliğini dinleyen effect ---

  useEffect(() => {
    // Tailwind'in 'md' breakpoint'i 768px'dir
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkIsMobile(); // Sayfa yüklendiğinde ilk kontrol
    window.addEventListener("resize", checkIsMobile); // Ekran boyutu değiştiğinde

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []); // Sadece component mount edildiğinde çalışır

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (arama.length >= 2) {
      const aramaYapiliyor = async () => {
        try {
          const gelenVeriler = await aramaYap(arama, signal);
          setVeriler(Array.isArray(gelenVeriler) ? gelenVeriler : []);
        } catch (err) {
          if (err.name === "AbortError") {
            // İptal edildi, bir şey yapma
          } else {
            setVeriler([]);
          }
        }
      };
      aramaYapiliyor();
    } else {
      setVeriler([]);
    }

    return () => {
      controller.abort();
    };
  }, [arama]);

  return (
    // --- 3. Ana kapsayıcıyı mobil için tam genişlik yap ---
    <div className={isMobileView ? "w-full px-4" : "relative"}>
      <input
        type="text" // --- 4. Input'u mobile göre stilize et ---
        className={
          isMobileView
            ? "dark:bg-primary-50 bg-primary-200 dark:placeholder:text-primary-500 placeholder:text-primary-950 text-primary-900 w-full rounded-md p-2 pl-4 text-lg"
            : "dark:bg-primary-50 bg-primary-200 dark:placeholder:text-primary-500 placeholder:text-primary-950 text-primary-900 w-[15rem] rounded-full p-1 pl-3 duration-300 focus:w-[20rem]"
        }
        placeholder="Film veya dizi ara..."
        onChange={(e) => setArama(e.target.value)}
        value={arama}
        onClick={() => setIsOpen(true)}
      />
      {veriler.length > 0 && isOpen && (
        <div // --- 5. Sonuçlar listesini mobile göre stilize et (absolute kaldırıldı) ---
          className={
            isMobileView
              ? "mt-4 grid max-h-[50vh] grid-cols-1 gap-2 overflow-y-auto" // Mobil: Statik, dikey kaydırmalı
              : "bg-primary-900 absolute top-12 z-50 grid w-[200%] -translate-x-1/4 grid-cols-2 gap-4 rounded-lg p-4 shadow-lg" // Desktop: Absolute
          }
          ref={aramaRef}
        >
          {veriler.map((veri) => (
            <Link // --- 6. Sonuç kartlarını mobile göre sıkıştır ---
              className={
                isMobileView
                  ? "bg-primary-800 hover:bg-primary-700 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg p-2 duration-300"
                  : "bg-primary-800 hover:bg-primary-700 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-xl p-2 duration-300"
              }
              key={veri.id}
              onClick={() => {
                setIsOpen(false);
                setArama("");
              }}
              href={
                veri.tur === "film"
                  ? `/icerikler/filmler/${veri.id}`
                  : `/icerikler/diziler/${veri.id}`
              }
            >
              {veri.fotograf && ( // --- 7. Görseli mobile göre küçült ---
                <div
                  className={
                    isMobileView ? "relative h-20 w-14" : "relative h-28 w-16"
                  }
                >
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
                  <h2
                    className={
                      isMobileView
                        ? "text-secondary-1 text-base font-semibold"
                        : "text-secondary-1 font-semibold"
                    }
                  >
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
                  <p
                    className={
                      isMobileView
                        ? "text-xs font-normal opacity-70"
                        : "text-sm font-normal opacity-70"
                    }
                  >
                    {veri.aciklama.slice(0, 75)}...
                  </p>
                </div>
                <p
                  className={
                    isMobileView
                      ? "dark:text-secondary-2 text-secondary-1 text-end text-xs font-normal"
                      : "dark:text-secondary-2 text-secondary-1 text-end text-sm font-normal"
                  }
                >
                  {veri.tur === "film" ? "Film" : "Dizi"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Arama;
