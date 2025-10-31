import { Suspense } from "react";
import { filmiGetir } from "../../../_lib/data-service-server";
import { FilmDetay } from "../../../types";
import Loading from "../../../loading";
import Image from "next/image";
import Footer from "../../../_components/Footer";
import supabaseServerClient from "../../../_lib/supabase/server";
import FilmButonlari from "../../../_components/icerikler/film-sayfasi/FilmButonlari";
import FilmIcerigi from "../../../_components/icerikler/film-sayfasi/FilmIcerigi";

const Page = async ({ params }: { params: { filmId: number } }) => {
  const { filmId } = await params;

  const film: FilmDetay = await filmiGetir(filmId);

  const supabase = await supabaseServerClient();

  const user = await (await supabase.auth.getUser()).data.user;

  const { id, isim, fotograf } = film;

  return (
    <Suspense fallback={<Loading />}>
      <div className="h-screen px-4 pt-40 pb-20">
        <div className="mx-auto flex h-full w-full max-w-[1360px] gap-x-10">
          <div className="relative aspect-[9/16] h-full">
            <Image
              alt={`${isim} filmi kapağı`}
              src={fotograf}
              className="object-cover"
              fill
            />
          </div>
          <div className="flex flex-col gap-y-6">
            <FilmIcerigi film={film} />
            <FilmButonlari id={id} user={user} />
          </div>
        </div>
      </div>
      <Footer />
    </Suspense>
  );
};

export default Page;
