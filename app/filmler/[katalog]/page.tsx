import React from "react";
import CategoriesSelect from "../../_components/CategoriesSelect";
import CategoriesFilter from "../../_components/CategoriesFilter";
import CategoriContent from "../../_components/CategoriContent";

const Page = async ({ params }: { params: { katalog: string } }) => {
  const { katalog } = await params;

  return (
    <div className="pt-40">
      <div className="mx-auto w-full max-w-[1360px]">
        <div className="mx-4">
          <CategoriesFilter katalog={katalog} />
          <div className="mt-20 grid grid-cols-[10rem_1fr] gap-x-10">
            <CategoriesSelect katalog={katalog} />
            <CategoriContent katalog={katalog} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
