"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {typeof totalResults === "number" && (
        <p className="hidden sm:block text-sm text-[var(--text-muted)]">
          Page {currentPage} of {totalPages} · {totalResults} result
          {totalResults === 1 ? "" : "s"}
        </p>
      )}

      <div className="flex items-center justify-center w-full sm:w-auto">
        <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="
            h-10 px-4 rounded-lg
            border border-[var(--border)]
            bg-[var(--surface)]
            hover:bg-[var(--surface-hover)]
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-colors
          "
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              h-10 w-10 rounded-lg font-medium transition-all
              ${
                page === currentPage
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
              }
            `}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="
            h-10 px-4 rounded-lg
            border border-[var(--border)]
            bg-[var(--surface)]
            hover:bg-[var(--surface-hover)]
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-colors
          "
        >
          Next
        </button>
        </div>
      </div>
    </div>
  );
}