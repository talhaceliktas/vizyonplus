"use client";

import { useMemo } from "react";
import { useQueryState } from "nuqs";
import { parsers } from "@/features/content/params/parsers";
import { MOVIE_GENRES, SERIES_GENRES } from "@/features/content/constants";

import TypeSelector from "./filters/TypeSelector";
import SortSelector from "./filters/SortSelector";
import GenreList from "./filters/GenreList";

export default function FilterBar() {
  const [tur, setTur] = useQueryState(
    "tur",
    parsers.tur.withOptions({ shallow: false }),
  );
  const [kategori, setKategori] = useQueryState(
    "kategori",
    parsers.kategori.withOptions({ shallow: false }),
  );
  const [sirala, setSirala] = useQueryState(
    "sirala",
    parsers.sirala.withOptions({ shallow: false }),
  );
  const [_, setPage] = useQueryState(
    "page",
    parsers.page.withOptions({ shallow: false }),
  );

  const activeGenres = useMemo(() => {
    if (tur === "film") return MOVIE_GENRES;
    if (tur === "dizi") return SERIES_GENRES;
    return Array.from(new Set([...MOVIE_GENRES, ...SERIES_GENRES])).sort();
  }, [tur]);

  const typeLabel =
    tur === "film"
      ? "Film Türleri"
      : tur === "dizi"
        ? "Dizi Türleri"
        : "Tüm Türler";

  const handleTypeChange = (newType: string | null) => {
    if (tur !== newType) {
      setTur(newType);
      setKategori(null);
      setPage(1);
    }
  };

  const handleCategoryChange = (newCategory: string | null) => {
    setKategori(newCategory);
    setPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSirala(newSort);
    setPage(1);
  };

  return (
    <div className="from-primary-900 to-primary-800 w-full rounded-2xl border border-white/5 bg-linear-to-r p-6 backdrop-blur-2xl transition-all duration-300">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <TypeSelector currentType={tur} onTypeChange={handleTypeChange} />
        <SortSelector currentSort={sirala} onSortChange={handleSortChange} />
      </div>

      <div className="my-5 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <GenreList
        genres={activeGenres}
        selectedGenre={kategori}
        onGenreSelect={handleCategoryChange}
        typeLabel={typeLabel}
      />
    </div>
  );
}
