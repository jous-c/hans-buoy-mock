import * as React from "react";

import { cn } from "@/lib/utils";

interface FieldItemProps {
  label: string;
  value?: React.ReactNode;
  className?: string;
}

function FieldItem({ label, value = "--", className }: FieldItemProps) {
  return (
    <div className={cn("flex gap-(--spacing-12) py-(--spacing-6)", className)}>
      <span className="w-[140px] shrink-0 text-xs leading-4 text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 flex-1 text-sm leading-5 text-foreground">
        {value}
      </span>
    </div>
  );
}

export { FieldItem };
export type { FieldItemProps };
