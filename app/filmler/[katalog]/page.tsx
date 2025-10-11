import React from "react";
import CategoriesSelect from "../../_components/CategoriesSelect";
import CategoriesFilter from "../../_components/CategoriesFilter";
import CategoryContent from "../../_components/CategoryContent";

const Page = async ({ params }: { params: { katalog: string } }) => {
  const { katalog } = await params;

  return (
    <div className="pt-40">
      <div className="mx-auto w-full max-w-[1360px]">
        <div className="mx-4">
          <CategoriesFilter />
          <div className="mt-10 grid grid-cols-[auto_1fr] gap-x-10">
            <CategoriesSelect katalog={katalog} />
            <CategoryContent katalog={katalog} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
