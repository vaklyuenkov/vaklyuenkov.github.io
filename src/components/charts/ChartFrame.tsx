import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  empty?: boolean;
  emptyLabel?: string;
  className?: string;
};

/** Keeps charts ~square on mobile; fixed height from sm breakpoint up. */
export function ChartFrame({ children, empty, emptyLabel = "No data", className }: Props) {
  return (
    <div
      className={cn(
        "w-full max-w-full min-h-0",
        "aspect-square max-h-[min(88vw,18.5rem)]",
        "sm:aspect-auto sm:max-h-none sm:h-[220px] md:h-[240px] lg:h-[260px]",
        className,
      )}
    >
      {empty ? (
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border/70 text-xs text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
