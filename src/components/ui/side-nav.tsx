import * as React from "react";
import {
  Compass,
  BookOpen,
  User,
  Mail,
  CalendarDays,
  Settings,
  ChevronDown,
  ArrowLeftToLine,
  ArrowRightToLine,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import hansHqLogo from "@/assets/hans-hq-logo.png";

export type NavItem = {
  icon: LucideIcon;
  label: string;
  href?: string;
  children?: { label: string; href?: string }[];
};

export const defaultNavItems: NavItem[] = [
  { icon: Compass, label: "Home" },
  { icon: BookOpen, label: "Sessions" },
  { icon: User, label: "Patients" },
  {
    icon: Mail,
    label: "Communications",
    children: [
      { label: "item" },
      { label: "item" },
      { label: "item" },
    ],
  },
  { icon: CalendarDays, label: "Scheduling" },
];

type SideNavProps = {
  className?: string;
  items?: NavItem[];
  activeLabel?: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onItemClick?: (label: string) => void;
};

function SideNav({
  className,
  items = defaultNavItems,
  activeLabel = "Patients",
  expanded: controlledExpanded,
  defaultExpanded = true,
  onExpandedChange,
  onItemClick,
}: SideNavProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded);
  const expanded = controlledExpanded ?? internalExpanded;

  const [openMenus, setOpenMenus] = React.useState<Set<string>>(() => {
    const initial = new Set<string>();
    items.forEach((item) => {
      if (item.children) initial.add(item.label);
    });
    return initial;
  });

  function toggleExpanded() {
    const next = !expanded;
    setInternalExpanded(next);
    onExpandedChange?.(next);
  }

  function toggleMenu(label: string) {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  return (
    <nav
      className={cn(
        "flex h-full flex-col bg-background",
        "px-(--spacing-12) py-(--spacing-24)",
        expanded ? "w-[222px] items-start justify-between" : "w-[68px] items-center gap-2.5",
        className,
      )}
    >
      {/* Collapsed: toggle button */}
      {!expanded && (
        <button
          onClick={toggleExpanded}
          className="flex shrink-0 items-center justify-center rounded-(--radius-6) p-0.5 text-foreground transition-colors hover:bg-secondary-lighter"
          aria-label="Expand sidebar"
        >
          <ArrowRightToLine className="size-5" />
        </button>
      )}

      {/* Top section: logo + nav */}
      <div
        className={cn(
          "flex shrink-0 flex-col items-start justify-center",
          expanded ? "gap-(--spacing-12) w-full" : "gap-6",
        )}
      >
        {/* Logo */}
        {!expanded ? (
          <img
            src={hansHqLogo}
            alt="HANS HQ"
            className="h-[31px] w-10 shrink-0 object-cover object-center"
          />
        ) : (
          <div className="flex items-center gap-3 shrink-0">
            <img
              src={hansHqLogo}
              alt="HANS HQ"
              className="h-[39px] w-40 object-cover object-center"
            />
            <button
              onClick={toggleExpanded}
              className="flex items-center justify-center rounded-(--radius-6) p-0.5 text-foreground transition-colors hover:bg-secondary-lighter"
              aria-label="Collapse sidebar"
            >
              <ArrowLeftToLine className="size-5" />
            </button>
          </div>
        )}

        {/* Nav items */}
        <div
          className={cn(
            "flex flex-col shrink-0",
            expanded ? "gap-1 items-start w-full" : "gap-2 items-center w-full",
          )}
        >
          {items.map((item) => {
            const isActive = item.label === activeLabel;
            const hasChildren = !!item.children;
            const isOpen = openMenus.has(item.label);
            const Icon = item.icon;

            return (
              <React.Fragment key={item.label}>
                {/* Nav item */}
                <button
                  onClick={() => {
                    if (hasChildren && expanded) {
                      toggleMenu(item.label);
                    } else {
                      onItemClick?.(item.label);
                    }
                  }}
                  className={cn(
                    "flex items-center transition-colors rounded-(--radius-8)",
                    isActive
                      ? "bg-secondary-lighter"
                      : "bg-background hover:bg-secondary-lighter",
                    expanded
                      ? "gap-2 h-9 w-full px-(--spacing-10) py-2"
                      : "size-10 justify-center",
                  )}
                  aria-label={!expanded ? item.label : undefined}
                  title={!expanded ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      "size-5 shrink-0",
                      isActive ? "text-foreground" : "text-text-sub",
                    )}
                  />
                  {expanded && (
                    <span
                      className={cn(
                        "text-sm font-medium leading-5 tracking-[-0.006em]",
                        isActive ? "text-foreground" : "text-text-sub",
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                  {expanded && hasChildren && (
                    <ChevronDown
                      className={cn(
                        "ml-auto size-5 shrink-0 text-text-sub transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  )}
                </button>

                {/* Sub-items (expanded only) */}
                {expanded && hasChildren && isOpen && (
                  <div className="flex w-full flex-col gap-1 pl-(--spacing-28)">
                    {item.children!.map((child, i) => (
                      <button
                        key={i}
                        onClick={() => onItemClick?.(child.label)}
                        className="flex items-center rounded-(--radius-8) bg-background py-2 pl-3 pr-4 text-sm font-medium leading-5 tracking-[-0.006em] text-text-sub transition-colors hover:bg-secondary-lighter"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* Settings icon in collapsed mode */}
          {!expanded && (
            <button
              onClick={() => onItemClick?.("Account & Settings")}
              className="flex size-10 items-center justify-center rounded-(--radius-8) bg-background transition-colors hover:bg-secondary-lighter"
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="size-5 text-text-sub" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom section (expanded only) */}
      {expanded && (
        <div className="flex w-full flex-col items-start shrink-0">
          <button
            onClick={() => onItemClick?.("Account & Settings")}
            className="flex h-8 items-center rounded-(--radius-8) bg-background pl-3 pr-4 py-2 text-sm font-medium leading-5 tracking-[-0.006em] text-muted-foreground transition-colors hover:bg-secondary-lighter"
          >
            Account &amp; Settings
          </button>
        </div>
      )}
    </nav>
  );
}

export { SideNav };
export type { SideNavProps };
