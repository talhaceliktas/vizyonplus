import Link from "next/link";

const CategoriesSelect = ({ katalog }: { katalog: string }) => {
  return (
    <div className="flex flex-col gap-y-5 text-2xl">
      <Link
        href="/filmler/vizyondakiler"
        className={` ${katalog === "vizyondakiler" ? "text-primary-50 underline" : "text-primary-200 opacity-50"}`}
      >
        Vizyondakiler
      </Link>
      <Link
        href="/filmler/yakindakiler"
        className={` ${katalog === "yakindakiler" ? "text-primary-50 underline" : "text-primary-200 opacity-50"}`}
      >
        Yakindakiler
      </Link>
      <Link
        href="/filmler/imdb"
        className={` ${katalog === "imdb" ? "text-primary-50 underline" : "text-primary-200 opacity-50"}`}
      >
        IMDB 100
      </Link>
    </div>
  );
};

export default CategoriesSelect;
