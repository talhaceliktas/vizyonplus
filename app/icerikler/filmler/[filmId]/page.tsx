import { Suspense } from "react";
import { filmiGetir } from "../../../_lib/data-service-server";
import { FilmTipi } from "../../../types";
import Loading from "../../../loading";
import Image from "next/image";
import Footer from "../../../_components/Footer";
import { MdDateRange } from "react-icons/md";
import { LuTimer } from "react-icons/lu";
import FavorilereEkleButton from "../../../_components/ui/FavorilereEkleButton";
import DahaSonraIzleButton from "../../../_components/ui/DahaSonraIzleButton";
import supabaseServerClient from "../../../_lib/supabase/server";
import Link from "next/link";

const Page = async ({ params }) => {
  const { filmId } = await params;

  const film: FilmTipi = await filmiGetir(filmId);

  const supabase = await supabaseServerClient();

  const user = await (await supabase.auth.getUser()).data.user;

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
            <div className="flex items-center justify-between">
              <h1 className="text-6xl">
                {film.isim}{" "}
                <span className="text-2xl italic opacity-50">
                  / {film.yonetmen}
                </span>
              </h1>
            </div>
            <div className="flex justify-between text-xl opacity-75">
              <div className="flex items-center gap-x-10">
                <h3 className="flex items-center gap-x-2">
                  <MdDateRange className="h-[30px] w-[30px]" />
                  {film.yayinlanma_tarihi}
                </h3>
                <h3 className="flex items-center gap-x-2">
                  <LuTimer className="h-[28px] w-[28px]" />
                  {Math.floor(film.sure / 60)}s {film.sure % 60}dk
                </h3>
              </div>
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
            <div className="flex justify-end gap-x-2">
              {user ? (
                <>
                  <FavorilereEkleButton icerik_id={film.id} />
                  <DahaSonraIzleButton icerik_id={film.id} />
                </>
              ) : (
                <Link
                  href="/giris"
                  className="text-secondary-3 hover:text-secondary-2 text-lg duration-300"
                >
                  Favorilere eklemek için giriş yap!
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Suspense>
  );
};

export default Page;
