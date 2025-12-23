/**
 * Bu sayfa, TÜM İÇERİKLERİN (`/icerikler`) listelendiği ana sayfadır.
 * Filtreleme (Tür, Kategori, Sıralama) ve Sayfalama (Pagination) işlemlerini yönetir.
 * URL Search Params (`?tur=film&kategori=aksiyon`) üzerinden çalışır, bu sayede filtreler paylaşılabilir.
 */

import { Suspense } from "react";
import FilterBar from "@/features/content/components/list/FilterBar";
import ContentCardSkeleton from "@/features/content/components/list/ContentCardSkeleton";
import ContentGrid from "@/features/content/components/list/ContentGrid";
import { searchParamsCache } from "@/features/content/params/searchParams";
import supabaseServer from "../../../lib/supabase/server";

// Next.js Page Props Tip Tanımı
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ContentPage({ searchParams }: PageProps) {
  // URL parametrelerini "parse" ederek güvenli tiplere dönüştür
  const resolvedParams = await searchParams;
  const { tur, kategori, sirala, page } =
    searchParamsCache.parse(resolvedParams);

  // Suspense için benzersiz anahtar oluştur (filtre değişince loading tetiklensin)
  const suspenseKey = JSON.stringify({ tur, kategori, sirala, page });

  const supabase = await supabaseServer();

  // Kullanıcı oturumu kontrolü (Şu an sadece log için, ileride kişiselleştirme eklenebilir)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto min-h-screen px-4 py-12 pt-40 md:px-8">
      {/* Sayfa Başlığı ve Açıklama */}
      <div className="mb-8">
        <h1 className="text-primary-100 text-3xl font-black tracking-tight md:text-4xl">
          Kütüphaneyi Keşfet
        </h1>
        <p className="text-primary-500 mt-2">
          {tur
            ? `${tur === "film" ? "Filmler" : "Diziler"} listeleniyor.`
            : "Tüm kütüphane listeleniyor."}
        </p>
      </div>

      {/* Filtreleme Çubuğu */}
      <div className="mb-10">
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
      </div>

      {/* İçerik Izgarası (Yüklenirken Skeleton göster) */}
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
