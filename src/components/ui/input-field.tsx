import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Search, Info, CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

const inputContainerVariants = cva(
  [
    "flex items-center gap-2 rounded-lg border px-3 py-2.5",
    "transition-colors duration-150",
    "has-disabled:opacity-50 has-disabled:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-stroke bg-white",
          "hover:border-stroke-sub",
          "focus-within:border-stroke-strong focus-within:border-2 focus-within:px-[11px] focus-within:py-[9px]",
        ].join(" "),
        destructive: "border-destructive bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type InputFieldProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputContainerVariants> & {
    label?: string;
    required?: boolean;
    optional?: boolean;
    hint?: string;
    leadingIcon?: React.ReactNode;
  };

function InputField({
  className,
  variant = "default",
  label,
  required,
  optional,
  hint,
  leadingIcon,
  disabled,
  id,
  ...props
}: InputFieldProps) {
  const inputId = id ?? React.useId();

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-center gap-1">
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-5 tracking-[-0.006em]",
              disabled ? "text-disabled" : "text-text-sub",
            )}
          >
            {label}
            {required && <span className="text-destructive">*</span>}
          </label>
          {optional && (
            <span className="text-sm text-muted-foreground">(Optional)</span>
          )}
          <Info
            className={cn(
              "size-4",
              disabled ? "text-icon-disabled" : "text-icon-soft",
            )}
          />
        </div>
      )}

      <div
        className={cn(
          inputContainerVariants({ variant }),
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        <span
          className={cn(
            "shrink-0 [&_svg]:size-5",
            disabled
              ? "text-icon-disabled"
              : variant === "destructive"
                ? "text-icon-soft"
                : "text-icon-soft",
          )}
        >
          {leadingIcon ?? <Search />}
        </span>
        <input
          id={inputId}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent text-sm leading-5 tracking-[-0.006em] outline-none",
            "text-foreground placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed",
          )}
          {...props}
        />
      </div>

      {hint && (
        <div className="flex items-center gap-1">
          {variant === "destructive" ? (
            <CircleAlert className="size-4 shrink-0 text-destructive" />
          ) : (
            <Info
              className={cn(
                "size-4 shrink-0",
                disabled ? "text-icon-disabled" : "text-icon-soft",
              )}
            />
          )}
          <span
            className={cn(
              "text-xs leading-4",
              variant === "destructive"
                ? "text-destructive"
                : disabled
                  ? "text-disabled"
                  : "text-muted-foreground",
            )}
          >
            {hint}
          </span>
        </div>
      )}
    </div>
  );
}

export { InputField, inputContainerVariants };
export type { InputFieldProps };
