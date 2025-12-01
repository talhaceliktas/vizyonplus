import Image from "next/image";
import { filmiGetir } from "../../_lib/data-service-server";
import { IcerikTipi } from "../../types";
import FavorilereEkleButton from "../ui/FavorilereEkleButton";
import Link from "next/link";
import DahaSonraIzleButton from "../ui/DahaSonraIzleButton";
import { FaPlay } from "react-icons/fa6";

const KayitliFilm = async ({
  icerik_id,
  kayitTuru,
}: {
  icerik_id: number;
  kayitTuru: string;
}) => {
  const film: IcerikTipi = await filmiGetir(icerik_id);

  const { id, isim, fotograf, tur, turler, aciklama } = film;
  const linkHref = tur === "film" ? `/izle/film/${id}` : `/izle/dizi/${id}`;

  return (
    // min-h-[11rem] ekleyerek kartın mobilde çok sıkışmasını engelledik
    <div className="group/card border-primary-800 bg-primary-900 hover:border-secondary-1/50 relative flex w-full flex-col overflow-hidden rounded-xl border transition-all hover:shadow-2xl sm:h-48 sm:flex-row">
      {/* SOL: RESİM ALANI */}
      <Link
        href={linkHref}
        // w-full sm:w-36: Mobilde resim tam genişlik, masaüstünde sabit genişlik
        // h-40 sm:h-full: Mobilde belli yükseklik, masaüstünde tam yükseklik
        className="group/image relative block h-40 w-full shrink-0 overflow-hidden sm:h-full sm:w-36"
      >
        <Image
          alt={`${isim} afişi`}
          src={fotograf}
          fill
          className="object-cover transition-transform duration-500 group-hover/image:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* PLAY OVERLAY */}
        <div className="bg-primary-50/40 absolute inset-0 z-10 flex items-center justify-center opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover/image:opacity-100">
          <div className="bg-secondary-2 text-primary-50 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover/image:scale-110">
            <FaPlay className="pl-1" />
          </div>
        </div>
      </Link>

      {/* SAĞ: İÇERİK ALANI */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex-1">
          <Link href={linkHref}>
            <h2 className="text-primary-50 group-hover/card:text-secondary-1 mb-1 line-clamp-1 text-lg font-bold transition-colors sm:text-xl">
              {isim}
            </h2>
          </Link>

          {/* Türler */}
          <div className="mb-2 flex flex-wrap gap-2 text-[10px] tracking-wider uppercase sm:text-xs">
            {turler.slice(0, 3).map((t, i) => (
              <span
                key={i}
                className="bg-primary-800 text-primary-400 rounded px-2 py-0.5 font-medium"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Açıklama: line-clamp-2 ile taşmayı engelledik */}
          <p className="text-primary-500 line-clamp-2 text-xs leading-relaxed sm:text-sm">
            {aciklama}
          </p>
        </div>

        {/* ALT KISIM: BUTONLAR */}
        {/* mt-auto ile her zaman en alta ittik */}
        <div className="border-primary-800 mt-3 flex items-center justify-end border-t pt-3 sm:mt-auto">
          <div className="relative z-20 transition-transform active:scale-95">
            {kayitTuru === "favori" ? (
              <FavorilereEkleButton icerik_id={id} />
            ) : (
              <DahaSonraIzleButton icerik_id={id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KayitliFilm;
