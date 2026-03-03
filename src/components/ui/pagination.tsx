import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { cn } from "@/lib/utils";

type PaginationProps = React.ComponentProps<"nav"> & {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  if (current <= 3) {
    pages.push(1, 2, 3, "ellipsis", total);
  } else if (current >= total - 2) {
    pages.push(1, "ellipsis", total - 2, total - 1, total);
  } else {
    pages.push(1, "ellipsis", current - 1, current, current + 1, "ellipsis", total);
  }

  return pages;
}

const pageButtonBase = cn(
  "flex size-8 items-center justify-center rounded-(--radius-8)",
  "text-sm font-medium leading-5 tracking-[-0.006em]",
  "transition-colors duration-150 cursor-pointer",
  "disabled:opacity-40 disabled:pointer-events-none",
);

function Pagination({
  className,
  currentPage,
  totalPages,
  onPageChange,
  ...props
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      <button
        className={cn(pageButtonBase, "text-muted-foreground hover:bg-secondary-lighter")}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="First page"
      >
        <ChevronsLeft className="size-4" />
      </button>

      <button
        className={cn(pageButtonBase, "text-muted-foreground hover:bg-secondary-lighter")}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className={cn(pageButtonBase, "pointer-events-none text-muted-foreground")}
            aria-hidden
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            className={cn(
              pageButtonBase,
              page === currentPage
                ? "bg-secondary text-secondary-foreground"
                : "text-foreground hover:bg-secondary-lighter",
            )}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ),
      )}

      <button
        className={cn(pageButtonBase, "text-muted-foreground hover:bg-secondary-lighter")}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>

      <button
        className={cn(pageButtonBase, "text-muted-foreground hover:bg-secondary-lighter")}
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
      >
        <ChevronsRight className="size-4" />
      </button>
    </nav>
  );
}

export { Pagination };
export type { PaginationProps };
