import Image from "next/image";
import { DiziDetay } from "../../../types";
import Link from "next/link";

const Dizi = ({ dizi }: { dizi: DiziDetay }) => {
  return (
    <Link
      className="flex flex-col gap-y-2 overflow-hidden rounded-lg grayscale-25 duration-300 hover:scale-110 hover:grayscale-0"
      href={`/icerikler/diziler/${dizi.id}`}
    >
      <div className="relative aspect-[619/919] w-full">
        <Image
          src={dizi.fotograf}
          alt={`${dizi.isim} Filmi`}
          fill
          className="object-contain opacity-85"
          loading="lazy"
          sizes="100%"
        />
      </div>
      <h2 className="text-center text-xl font-semibold">{dizi.isim}</h2>
      <div className="text-primary-50 flex flex-col text-center">
        <p className="opacity-75">
          {dizi.turler.map((tur, index) => (
            <span key={tur}>
              {index !== 0 && "| "}
              {tur}{" "}
            </span>
          ))}
        </p>
      </div>
    </Link>
  );
};

export default Dizi;
