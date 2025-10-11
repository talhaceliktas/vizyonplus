import Link from "next/link";

const CategoriesSelect = ({ katalog }: { katalog: string }) => {
  return (
    <div className="relative">
      <div className="sticky top-50 flex flex-col gap-y-5 text-2xl">
        <Link
          href="/filmler/vizyondakiler"
          className={`w-fit duration-300 ${katalog === "vizyondakiler" ? "text-primary-50 underline" : "text-primary-200 categori-button opacity-50 hover:opacity-75"}`}
        >
          Vizyondakiler
        </Link>
        <Link
          href="/filmler/yakindakiler"
          className={`w-fit duration-300 ${katalog === "yakindakiler" ? "text-primary-50 underline" : "text-primary-200 categori-button opacity-50 hover:opacity-75"}`}
        >
          Yakindakiler
        </Link>
        <Link
          href="/filmler/imdb"
          className={`w-fit duration-300 ${katalog === "imdb" ? "text-primary-50 underline" : "text-primary-200 categori-button opacity-50 hover:opacity-75"}`}
        >
          IMDB 100
        </Link>
      </div>
    </div>
  );
};

export default CategoriesSelect;
