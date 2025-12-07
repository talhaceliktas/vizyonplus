"use client";

import { useQueryState } from "nuqs";
import { parsers } from "../../params/parsers";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface PaginationProps {
  totalCount: number;
}

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_CONTENT_PAGE_SIZE!);

export default function Pagination({ totalCount }: PaginationProps) {
  const [page, setPage] = useQueryState(
    "page",
    parsers.page.withOptions({
      shallow: false,
      scroll: true,
    }),
  );

  const currentPage = page || 1;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-full border transition-all disabled:opacity-30 disabled:cursor-not-allowed " +
    "bg-white border-gray-200 text-gray-700 hover:bg-gray-100 disabled:hover:bg-white " +
    "dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10 dark:disabled:hover:bg-transparent";

  return (
    <div className="mt-12 flex justify-center gap-2">
      {/* --- ÖNCEKİ BUTONU --- */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={buttonClass}
        aria-label="Önceki Sayfa"
      >
        <FaChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 dark:border-white/10 dark:bg-black/20">
        <span className="dark:text-secondary-1 text-sm font-bold text-gray-900">
          {currentPage}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">/</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {totalPages}
        </span>
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={buttonClass}
        aria-label="Sonraki Sayfa"
      >
        <FaChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
