import { Suspense } from "react";
import { filmiGetir } from "../../../_lib/data-service";
import { FilmTipi } from "../../../types";
import Loading from "../../../loading";
import Image from "next/image";
import Footer from "../../../_components/Footer";

const Page = async ({ params }) => {
  const { filmId } = await params;

  const film: FilmTipi = await filmiGetir(filmId);

  return (
    <Suspense fallback={<Loading />}>
      <div className="h-screen px-4 pt-40 pb-20">
        <div className="mx-auto flex h-full w-full max-w-[1360px] gap-x-10">
          <div className="relative aspect-[9/16] h-full">
            <Image
              alt={`${film.isim} filmi kapağı`}
              src={film.fotograf}
              className="object-cover"
              fill
            />
          </div>
          <div className="flex flex-col gap-y-6">
            <h1 className="text-6xl">{film.isim}</h1>
            <div className="flex justify-between text-xl opacity-75">
              <h3 className="italic">Yönetmen: {film.yonetmen}</h3>
              <h3>
                {film.turler.map((tur, index) => (
                  <span key={tur}>
                    {index !== 0 && "| "}
                    {tur}{" "}
                  </span>
                ))}
              </h3>
            </div>
            <p className="text-lg">{film.aciklama}</p>
          </div>
        </div>
      </div>
      <Footer />
    </Suspense>
  );
};

export default Page;
