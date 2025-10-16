import React, { Suspense } from "react";
import CategoriesSelect from "../../_components/CategoriesSelect";
import CategoriesFilter from "../../_components/CategoriesFilter";
import CategoryContent from "../../_components/CategoryContent";
import Loading from "../../loading";
import MovieLoading from "../../_components/MovieLoading";
import Footer from "../../_components/Footer";

export async function generateStaticParams() {
  return [
    { katalog: "vizyondakiler" },
    { katalog: "yakindakiler" },
    { katalog: "imdb" },
  ];
}

const Page = async ({ params }: { params: { katalog: string } }) => {
  const { katalog } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <div className="mt-40">
        <div className="mx-auto w-full max-w-[1360px]">
          <div className="mx-4">
            <CategoriesFilter />
            <div className="mt-10 grid grid-cols-[auto_1fr] gap-x-10">
              <CategoriesSelect katalog={katalog} />
              <Suspense fallback={<MovieLoading />}>
                <CategoryContent katalog={katalog} />
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
