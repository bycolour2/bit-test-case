import { ArrowNarrowLeft, ArrowNarrowRight } from "~/shared/assets/icons";
import { cn } from "~/shared/lib/cn";

export const Pagination = () => {
  return (
    <div className="mb-12 inline-flex items-center justify-center gap-1">
      <div className="flex items-center justify-center gap-0.5 rounded-lg px-2.5 py-1.5">
        <ArrowNarrowLeft />
      </div>
      <div
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
      </div>
      <div className="flex items-center justify-center gap-0.5 rounded-lg px-2.5 py-1.5">
        <ArrowNarrowRight />
      </div>
    </div>
  );
};
