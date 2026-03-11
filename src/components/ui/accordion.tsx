import * as React from "react";
import { ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

function Accordion({ title, defaultOpen = true, children, className }: AccordionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("border-t border-stroke", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between px-(--spacing-24) py-(--spacing-16)"
      >
        <span className="text-sm font-semibold leading-5 text-foreground">
          {title}
        </span>
        <ChevronUp
          className={cn(
            "size-4 shrink-0 text-(--color-icon-sub-800) transition-transform duration-200 ease-in-out",
            !open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-(--spacing-24) pb-(--spacing-16)">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Accordion };
export type { AccordionProps };
