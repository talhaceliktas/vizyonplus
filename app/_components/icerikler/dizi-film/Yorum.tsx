import Image from "next/image";
import { YorumTipi } from "../../../types";

const Yorum = ({ yorum }: { yorum: YorumTipi }) => {
  return (
    <div className="flex w-full gap-x-4 pb-4">
      <div className="relative h-16 w-16">
        <Image
          alt={`${yorum.profiller.isim} profil fotografi`}
          src={yorum.profiller.profil_fotografi || "/default-user.jpg"}
          className="rounded-full"
          fill
        />
      </div>
      <div className="w-full">
        <h2 className="text-secondary-1 text-base font-semibold sm:text-xl">
          {yorum.profiller.isim}
        </h2>
        <p className="text-primary-100 text-sm sm:text-base">{yorum.yorum}</p>
        <p className="mt-5 w-full text-end text-xs sm:mt-0 sm:text-base">
          {new Date(yorum.olusturulma_zamani)
            .toLocaleDateString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })
            .replaceAll(".", "/")}
        </p>
      </div>
    </div>
  );
};

export default Yorum;
