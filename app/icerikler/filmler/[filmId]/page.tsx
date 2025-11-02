import { Suspense } from "react";
import { filmiGetir } from "../../../_lib/data-service-server";
import { FilmDetay } from "../../../types";
import Loading from "../../../loading";
import Image from "next/image";
import Footer from "../../../_components/Footer";
import supabaseServerClient from "../../../_lib/supabase/server";
import IcerikButonlari from "../../../_components/icerikler/dizi-film/IcerikButonlari";
import FilmIcerigi from "../../../_components/icerikler/FilmIcerigi";
import Yorumlar from "../../../_components/icerikler/dizi-film/Yorumlar";

const Page = async ({ params }: { params: { filmId: number } }) => {
  const { filmId } = await params;

  const film: FilmDetay = await filmiGetir(filmId);

  const supabase = await supabaseServerClient();

  const user = await (await supabase.auth.getUser()).data.user;

  const { id, isim, fotograf } = film;

  return (
    <Suspense fallback={<Loading />}>
      <div className="text-primary-50 px-4 pt-40 pb-20">
        <div className="mx-auto flex h-full w-full max-w-[1360px] flex-col gap-y-20">
          <div className="flex gap-x-10 gap-y-10">
            <div className="relative aspect-[9/16] w-full max-w-[400px]">
              <Image
                alt={`${isim} filmi kapağı`}
                src={fotograf}
                className="rounded-xl object-cover"
                fill
              />
            </div>

            <div className="flex w-full flex-col gap-y-6">
              <FilmIcerigi film={film} />
              <IcerikButonlari id={id} user={user} />
            </div>
          </div>
          <Yorumlar icerikId={id} />
        </div>
      </div>
      <Footer />
    </Suspense>
  );
};

export default Page;
