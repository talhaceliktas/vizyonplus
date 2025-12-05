import { Suspense } from "react";
import FilterBar from "@/features/content/components/list/FilterBar";
import ContentCardSkeleton from "@/features/content/components/list/ContentCardSkeleton";
import ContentGrid from "@/features/content/components/list/ContentGrid"; // Yeni bileşeni import et
import { searchParamsCache } from "@/features/content/params/searchParams";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ContentPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { tur, kategori, sirala, page } =
    searchParamsCache.parse(resolvedParams);

  const suspenseKey = JSON.stringify({ tur, kategori, sirala, page });

  return (
    <div className="container mx-auto min-h-screen px-4 py-12 pt-40 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
          Kütüphaneyi Keşfet
        </h1>
        <p className="mt-2 text-gray-400">
          {tur
            ? `${tur === "film" ? "Filmler" : "Diziler"} listeleniyor.`
            : "Tüm kütüphane listeleniyor."}
        </p>
      </div>

      <div className="mb-10">
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
      </div>

      <Suspense
        key={suspenseKey}
        fallback={
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <ContentCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ContentGrid
          tur={tur}
          kategori={kategori}
          sirala={sirala}
          page={page}
        />
      </Suspense>
    </div>
  );
}
