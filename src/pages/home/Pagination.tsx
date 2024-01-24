import { useUnit } from "effector-react";

import { ArrowNarrowLeft, ArrowNarrowRight } from "~/shared/assets/icons";
import { cn } from "~/shared/lib/cn";

import { $currentPage, $maxPage, currentPageChanged } from "./model";

export const Pagination = () => {
  const [currentPage, maxPage, handleSetPage] = useUnit([
    $currentPage,
    $maxPage,
    currentPageChanged,
  ]);

  return (
    <div className="inline-flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => handleSetPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center gap-0.5 rounded-lg px-2.5 py-1.5",
          currentPage === 1 ? "" : "hover:bg-strong-down",
        )}
      >
        <ArrowNarrowLeft />
      </button>
      {Array.from({ length: maxPage }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => handleSetPage(i + 1)}
          disabled={currentPage === i + 1}
          className={cn(
            "flex h-9 w-9 items-center justify-center gap-0.5 rounded-lg px-3.5 py-1.5 text-sm font-medium",
            currentPage === i + 1 ? "bg-strong" : "hover:bg-strong-down",
          )}
        >
          {i + 1}
        </button>
      ))}
      {/* <div
        className={cn(
          "flex items-center justify-center gap-0.5 rounded-lg px-3.5 py-1.5 text-sm font-medium",
          true && "bg-strong",
        )}
      >
        1
      </div>
      <div className="flex items-center justify-center gap-0.5 rounded-lg px-3.5 py-1.5 text-sm font-medium">
        2
      </div>
      <div className="flex items-center justify-center gap-0.5 rounded-lg px-3.5 py-1.5 text-sm font-medium">
        3
      </div>
      <div className="flex items-center justify-center gap-0.5 rounded-lg px-3.5 py-1.5 text-sm font-medium">
        4
      </div>
      <div className="flex items-center justify-center gap-0.5 rounded-lg px-3.5 py-1.5 text-sm font-medium">
        ....
      </div>
      <div className="flex items-center justify-center gap-0.5 rounded-lg px-3.5 py-1.5 text-sm font-medium">
        104
      </div> */}
      <button
        type="button"
        onClick={() => handleSetPage(currentPage + 1)}
        disabled={currentPage === maxPage}
        className={cn(
          "flex h-9 w-9 items-center justify-center gap-0.5 rounded-lg px-2.5 py-1.5",
          currentPage === maxPage ? "" : "hover:bg-strong-down",
        )}
      >
        <ArrowNarrowRight />
      </button>
    </div>
  );
};
