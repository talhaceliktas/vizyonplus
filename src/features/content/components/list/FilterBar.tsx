/**
 * Bu bileşen, içerik listeleme sayfasındaki filtreleme ve sıralama araç çubuğudur.
 * URL query parametrelerini (tur, kategori, sirala) yönetmek için `nuqs` kütüphanesini kullanır.
 * Kategori filtrelemesi çoklu seçime (array) izin verir.
 */

"use client";

import { useMemo } from "react";
import { useQueryState } from "nuqs";
import { parsers } from "@/features/content/params/parsers";
import { MOVIE_GENRES, SERIES_GENRES } from "@/features/content/constants";

import TypeSelector from "./filters/TypeSelector";
import SortSelector from "./filters/SortSelector";
import GenreList from "./filters/GenreList";

export default function FilterBar() {
  // URL State Yönetimi Hooks
  const [tur, setTur] = useQueryState(
    "tur",
    parsers.tur.withOptions({ shallow: false }), // shallow: false -> Server Component yeniden çalışsın
  );

  // Kategoriler string array olarak tutulur
  const [kategori, setKategori] = useQueryState(
    "kategori",
    parsers.kategori.withOptions({ shallow: false }),
  );

  const [sirala, setSirala] = useQueryState(
    "sirala",
    parsers.sirala.withOptions({ shallow: false }),
  );

  // Filtre değişince sayfayı başa al
  const [_, setPage] = useQueryState(
    "page",
    parsers.page.withOptions({ shallow: false }),
  );

  // Seçili türe göre gösterilecek kategorileri belirle
  const activeGenres = useMemo(() => {
    if (tur === "film") return MOVIE_GENRES;
    if (tur === "dizi") return SERIES_GENRES;
    // Tümü seçiliyse birleştirip sırala
    return Array.from(new Set([...MOVIE_GENRES, ...SERIES_GENRES])).sort();
  }, [tur]);

  const typeLabel =
    tur === "film"
      ? "Film Türleri"
      : tur === "dizi"
        ? "Dizi Türleri"
        : "Tüm Türler";

  // Tür değişimi (Film <-> Dizi)
  const handleTypeChange = (newType: string | null) => {
    if (tur !== newType) {
      setTur(newType);
      setKategori(null); // Kategoriler türe özgü olabileceği için sıfırla
      setPage(1);
    }
  };

  // Kategori Çoklu Seçim Mantığı (Toggle)
  const handleCategoryChange = (genre: string) => {
    setKategori((old) => {
      const current = old || [];
      if (current.includes(genre)) {
        // Varsa listeden çıkar
        const next = current.filter((c) => c !== genre);
        return next.length > 0 ? next : null; // Boşsa URL'den sil
      } else {
        // Yoksa ekle
        return [...current, genre];
      }
    });
    setPage(1);
  };

  return (
    <div className="from-primary-900 to-primary-800 w-full rounded-2xl border border-white/5 bg-linear-to-r p-6 backdrop-blur-2xl transition-all duration-300">
      {/* Üst Kısım: Tür ve Sıralama Seçicileri */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <TypeSelector currentType={tur} onTypeChange={handleTypeChange} />
        <SortSelector
          currentSort={sirala}
          onSortChange={(v) => {
            setSirala(v);
            setPage(1);
          }}
        />
      </div>

      {/* Ayırıcı Çizgi */}
      <div className="my-5 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

      {/* Alt Kısım: Kategori Listesi */}
      <GenreList
        genres={activeGenres}
        selectedGenres={kategori || []}
        onGenreToggle={handleCategoryChange}
        typeLabel={typeLabel}
      />
    </div>
  );
}
