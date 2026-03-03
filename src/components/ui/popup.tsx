import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface PopupProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

function Popup({ open, onClose, title, children, footer, className }: PopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <div
        className={cn(
          "relative z-10 flex h-[524px] w-[620px] flex-col overflow-hidden rounded-(--radius-16) bg-bg-white shadow-xl",
          className,
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-(--spacing-24) pt-(--spacing-24) pb-(--spacing-16)">
          <h2 className="text-lg font-semibold leading-7 text-foreground">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-(--radius-6) text-foreground transition-colors hover:bg-secondary-lighter cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-stroke">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex shrink-0 items-center justify-between border-t border-stroke px-(--spacing-24) py-(--spacing-16)">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export { Popup };
export type { PopupProps };
