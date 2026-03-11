import * as React from "react";

import { cn } from "@/lib/utils";

// ─── Popover Menu Item ───────────────────────────────────

interface PopoverMenuItemProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

function PopoverMenuItem({ label, onClick, className }: PopoverMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer rounded-(--radius-8) px-(--spacing-12) py-(--spacing-10) text-left text-sm leading-5 text-foreground transition-colors hover:bg-secondary-lighter",
        className,
      )}
    >
      {label}
    </button>
  );
}

// ─── Popover Menu ────────────────────────────────────────

interface PopoverMenuProps {
  open: boolean;
  onClose: () => void;
  items: { label: string; onClick?: () => void }[];
  className?: string;
}

function PopoverMenu({ open, onClose, items, className }: PopoverMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute z-50 min-w-[200px] rounded-(--radius-12) border border-stroke bg-bg-white p-(--spacing-6) shadow-lg",
        className,
      )}
    >
      {items.map((item) => (
        <PopoverMenuItem
          key={item.label}
          label={item.label}
          onClick={() => {
            item.onClick?.();
            onClose();
          }}
        />
      ))}
    </div>
  );
}

export { PopoverMenu, PopoverMenuItem };
export type { PopoverMenuProps, PopoverMenuItemProps };
