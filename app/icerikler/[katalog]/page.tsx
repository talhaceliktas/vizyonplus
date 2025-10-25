import React, { Suspense } from "react";
import KategoriSecim from "../../_components/icerikler/KategoriSecim";
import KategoriSiralama from "../../_components/icerikler/KategoriSiralama";
import KategoriIcerik from "../../_components/icerikler/KategoriIcerik";
import Loading from "../../loading";
import Yukleniyor from "../../_components/icerikler/Yukleniyor";
import Footer from "../../_components/Footer";

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
            <KategoriSiralama />
            <div className="mt-10 grid grid-cols-[auto_1fr] gap-x-10">
              <KategoriSecim katalog={katalog} />
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
