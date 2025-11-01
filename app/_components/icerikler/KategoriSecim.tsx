import Link from "next/link";

const KategoriSecim = ({ katalog }: { katalog: string }) => {
  return (
    <div>
      <div className="top-50 flex flex-col gap-y-5 text-2xl">
        <Link
          href="/icerikler/diziler"
          className={`w-fit duration-300 ${katalog === "diziler" ? "text-primary-50 underline" : "text-primary-200 categori-button opacity-50 hover:opacity-75"}`}
        >
          Diziler
        </Link>
        <Link
          href="/icerikler/filmler"
          className={`w-fit duration-300 ${katalog === "filmler" ? "text-primary-50 underline" : "text-primary-200 categori-button opacity-50 hover:opacity-75"}`}
        >
          Filmler
        </Link>
        <Link
          href="/icerikler/yakindakiler"
          className={`w-fit duration-300 ${katalog === "yakindakiler" ? "text-secondary-1 underline" : "text-secondary-2 categori-button categori-button-imdb opacity-50 hover:opacity-75"}`}
        >
          Çok Yakında
        </Link>
      </div>
    </div>
  );
};

export default KategoriSecim;
