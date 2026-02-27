import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-colors duration-150 cursor-pointer",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        filled: "",
        stroke: "border border-stroke bg-bg-white",
        lighter: "",
        ghost: "bg-transparent",
      },
      color: {
        primary: "",
        secondary: "",
        destructive: "",
      },
      size: {
        sm: "h-8 rounded-sm px-3 text-xs [&_svg]:size-3.5",
        md: "h-9 rounded-md px-4 text-sm [&_svg]:size-4",
        lg: "h-10 rounded-lg px-5 text-base [&_svg]:size-5",
        icon: "size-9 rounded-md [&_svg]:size-4",
        compact: "size-9 rounded-md p-0.5 shadow-sm [&_svg]:size-5",
      },
    },
    compoundVariants: [
      { variant: "filled", color: "primary", className: "bg-primary text-primary-foreground hover:bg-primary-dark" },
      { variant: "filled", color: "secondary", className: "bg-secondary text-secondary-foreground hover:bg-secondary-dark" },
      { variant: "stroke", color: "primary", className: "text-primary hover:bg-primary-lighter" },
      { variant: "stroke", color: "secondary", className: "bg-bg-white text-secondary hover:bg-secondary-light" }, //nees to have solid white bg not sure if its applied
      { variant: "lighter", color: "primary", className: "bg-primary-lighter text-primary hover:bg-primary-light" },
      { variant: "lighter", color: "secondary", className: "bg-secondary-lighter text-secondary hover:bg-secondary-light" },
      { variant: "ghost", color: "primary", className: "text-primary hover:bg-primary-lighter" },
      { variant: "ghost", color: "secondary", className: "text-secondary hover:bg-secondary-lighter" },
      { variant: "filled", color: "destructive", className: "bg-destructive text-destructive-foreground hover:bg-destructive-dark" },
      { variant: "stroke", color: "destructive", className: "bg-bg-white text-destructive hover:bg-destructive-lighter" },
      { variant: "lighter", color: "destructive", className: "bg-destructive-lighter text-destructive hover:bg-destructive-light" },
      { variant: "ghost", color: "destructive", className: "text-destructive hover:bg-destructive-lighter" },
    ],
    defaultVariants: {
      variant: "filled",
      color: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, color, size, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, color, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
