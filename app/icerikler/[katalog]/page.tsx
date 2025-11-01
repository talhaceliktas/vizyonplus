import React, { Suspense } from "react";
import KategoriSecim from "../../_components/icerikler/KategoriSecim";
import KategoriSiralama from "../../_components/icerikler/KategoriSiralama";
import KategoriIcerik from "../../_components/icerikler/KategoriIcerik";
import Loading from "../../loading";
import Yukleniyor from "../../_components/ui/Yukleniyor";
import Footer from "../../_components/Footer";
import IcerikTurFiltre from "../../_components/icerikler/dizi-film/IcerikTurFiltre";

export async function generateStaticParams() {
  return [
    { katalog: "diziler" },
    { katalog: "filmler" },
    { katalog: "yakindakiler" },
    { katalog: "begenilenler" },
  ];
}

const Page = async ({ params }: { params: { katalog: string } }) => {
  const { katalog } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <div className="mt-40">
        <div className="mx-auto w-full max-w-[1360px]">
          <div className="mx-4">
            <KategoriSiralama katalog={katalog} />
            <div className="mt-10 grid grid-cols-[12.5rem_1fr] gap-x-10">
              <div className="relative">
                <div className="sticky top-40 flex flex-col gap-y-10">
                  <KategoriSecim katalog={katalog} />
                  <IcerikTurFiltre />
                </div>
              </div>
              <Suspense fallback={<Yukleniyor />}>
                <KategoriIcerik katalog={katalog} />
              </Suspense>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Suspense>
  );
};

export default Page;
