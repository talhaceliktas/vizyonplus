"use client";

import { useState } from "react";
import { FaCheck, FaChevronDown, FaChevronUp, FaFilter } from "react-icons/fa6";

interface GenreListProps {
  genres: string[];
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
  typeLabel: string;
}

export default function GenreList({
  genres,
  selectedGenre,
  onGenreSelect,
  typeLabel,
}: GenreListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleGenres = isExpanded ? genres : genres.slice(0, 12);
  const hasMore = genres.length > 12;

  return (
    <div className="flex flex-col gap-3">
      <div className="text-primary-50 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
        <FaFilter />
        <span>{typeLabel}</span>
        {selectedGenre && (
          <span className="text-secondary-1 ml-1">
            • {selectedGenre} Seçili
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 transition-all duration-500 ease-in-out">
        {visibleGenres.map((kat) => {
          const isSelected = selectedGenre === kat;
          return (
            <button
              key={kat}
              onClick={() => onGenreSelect(isSelected ? null : kat)}
              className={`group flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                isSelected
                  ? "border-secondary-2 bg-secondary-1-2 text-black shadow-md shadow-yellow-500/20"
                  : "bg-primary-700 text-primary-100/80 hover:border-primary-50/20 hover:text-primary-50 border-white/10 hover:bg-white/10"
              }`}
            >
              {isSelected && <FaCheck size={10} />}
              {kat}
            </button>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-secondary-1 mt-2 flex items-center gap-2 self-start text-xs font-bold hover:underline"
        >
          {isExpanded ? (
            <>
              <FaChevronUp /> Daha Az Göster{" "}
            </>
          ) : (
            <>
              <FaChevronDown /> Tümünü Göster (+{genres.length - 12}){" "}
            </>
          )}
        </button>
      )}
    </div>
  );
}
