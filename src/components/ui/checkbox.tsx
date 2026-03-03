import * as React from "react";

import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.ComponentProps<"input">, "type"> & {
  label?: React.ReactNode;
};

function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-(--radius-6) px-(--spacing-4) py-(--spacing-6) transition-colors hover:bg-secondary-lighter",
        props.disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="size-4 shrink-0 cursor-pointer rounded border-stroke-sub accent-primary"
        {...props}
      />
      {label && (
        <span className="text-sm leading-5 text-foreground">{label}</span>
      )}
    </label>
  );
}

export { Checkbox };
export type { CheckboxProps };
