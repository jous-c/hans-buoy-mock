import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const viewTabVariants = cva(
  [
    "group inline-flex items-center justify-center gap-0.5 overflow-hidden",
    "rounded-full px-4 py-2 border border-transparent",
    "transition-colors duration-150 cursor-pointer",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      selected: {
        true: "bg-secondary border-stroke",
        false: "hover:bg-(--alpha-neutral-10)",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

type ViewTabProps = React.ComponentProps<"button"> &
  VariantProps<typeof viewTabVariants> & {
    count?: number | string;
  };

function ViewTab({
  className,
  selected = false,
  count,
  children,
  ...props
}: ViewTabProps) {
  return (
    <button
      role="tab"
      aria-selected={selected || undefined}
      className={cn(viewTabVariants({ selected, className }))}
      {...props}
    >
      <span
        className={cn(
          "px-1 text-sm font-medium leading-5 tracking-[-0.006em]",
          selected ? "text-(--color-text-white-0)" : "text-foreground",
        )}
      >
        {children}
      </span>
      {count !== undefined && (
        <span
          className={cn(
            "text-xs font-medium leading-4",
            selected
              ? "text-neutral-100"
              : "text-muted-foreground group-hover:text-disabled",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export { ViewTab, viewTabVariants };
export type { ViewTabProps };
