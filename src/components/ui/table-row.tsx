import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Status Badge ─────────────────────────────────────────

type BadgeVariant =
  | "error"
  | "warning"
  | "success"
  | "faded"
  | "information"
  | "feature"
  | "away"
  | "verified"
  | "highlighted"
  | "stable";

const badgeColorMap: Record<BadgeVariant, { dot: string; text: string }> = {
  error: {
    dot: "bg-[var(--color-state-error-base)]",
    text: "text-[var(--color-state-error-dark)]",
  },
  warning: {
    dot: "bg-[var(--color-state-warning-base)]",
    text: "text-[var(--color-state-warning-dark)]",
  },
  success: {
    dot: "bg-[var(--color-state-success-base)]",
    text: "text-[var(--color-state-success-dark)]",
  },
  faded: {
    dot: "bg-[var(--color-state-faded-base)]",
    text: "text-foreground",
  },
  information: {
    dot: "bg-[var(--color-state-information-base)]",
    text: "text-[var(--color-state-information-dark)]",
  },
  feature: {
    dot: "bg-[var(--color-state-feature-base)]",
    text: "text-[var(--color-state-feature-dark)]",
  },
  away: {
    dot: "bg-[var(--color-state-away-base)]",
    text: "text-[var(--color-state-away-dark)]",
  },
  verified: {
    dot: "bg-[var(--color-state-verified-base)]",
    text: "text-[var(--color-state-verified-dark)]",
  },
  highlighted: {
    dot: "bg-[var(--color-state-highlighted-base)]",
    text: "text-[var(--color-state-highlighted-dark)]",
  },
  stable: {
    dot: "bg-[var(--color-state-stable-base)]",
    text: "text-[var(--color-state-stable-dark)]",
  },
};

interface StatusBadgeProps {
  label: string;
  variant: BadgeVariant;
}

function StatusBadge({ label, variant }: StatusBadgeProps) {
  const colors = badgeColorMap[variant];
  return (
    <span className="inline-flex items-center gap-1.5 py-0.5">
      <span className={cn("size-1 shrink-0 rounded-full", colors.dot)} />
      <span
        className={cn(
          "text-sm font-medium leading-5 tracking-[-0.006em] whitespace-nowrap",
          colors.text,
        )}
      >
        {label}
      </span>
    </span>
  );
}

// ─── Table Row Cell ───────────────────────────────────────

type TableRowCellProps = React.ComponentProps<"div">;

function TableRowCell({ className, children, ...props }: TableRowCellProps) {
  return (
    <div
      role="cell"
      className={cn(
        "flex h-16 shrink-0 items-center overflow-hidden bg-bg-white transition-colors duration-150 ease-in-out group-hover:bg-secondary-lighter",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Table Row ────────────────────────────────────────────

interface TableRowProps extends React.ComponentProps<"div"> {
  name: string;
  subtitle?: string;
  patientId?: string;
  riskStatus?: StatusBadgeProps;
  priority?: StatusBadgeProps;
  program?: string;
  provider?: string;
  lastSession?: string;
  nextSession?: string;
  endDate?: string;
  lastCimtDate?: string;
  lastSleep?: string;
  inflammationPanel?: boolean;
  lastOralDate?: string;
  insurance?: string;
  contractType?: string;
  contractExpiration?: string;
}

function TableRow({
  className,
  name,
  subtitle,
  patientId,
  riskStatus,
  priority,
  program,
  provider,
  lastSession,
  nextSession,
  endDate,
  lastCimtDate,
  lastSleep,
  inflammationPanel,
  lastOralDate,
  insurance,
  contractType,
  contractExpiration,
  ...props
}: TableRowProps) {
  const textCell = "min-w-0 flex-1 truncate text-sm leading-5 tracking-[-0.006em] text-foreground";

  return (
    <div
      role="row"
      className={cn(
        "group flex w-full items-center border-b border-stroke cursor-pointer",
        className,
      )}
      {...props}
    >
      <TableRowCell className="sticky left-0 z-5 w-[220px] gap-3 py-3 pl-6 pr-5 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-base font-medium leading-6 tracking-[-0.011em] text-foreground">
            {name}
          </span>
          {subtitle && (
            <span className="truncate text-xs leading-4 text-text-sub">
              {subtitle}
            </span>
          )}
        </div>
      </TableRowCell>

      <TableRowCell className="w-[120px] gap-3 py-3 pl-3 pr-5">
        <span className={cn(textCell, "text-sm text-text-sub")}>{patientId}</span>
      </TableRowCell>

      <TableRowCell className="w-[150px] gap-2 p-3">
        {riskStatus && <StatusBadge {...riskStatus} />}
      </TableRowCell>

      <TableRowCell className="w-[150px] gap-2 p-3">
        {priority && <StatusBadge {...priority} />}
      </TableRowCell>

      <TableRowCell className="w-[240px] gap-3 py-3 pl-3 pr-5">
        <span className={textCell}>{program}</span>
      </TableRowCell>

      <TableRowCell className="w-[140px] gap-3 py-3 pl-3 pr-5">
        <span className={textCell}>{provider}</span>
      </TableRowCell>

      <TableRowCell className="w-[140px] gap-3 py-3 pl-3 pr-5">
        <span className={textCell}>{lastSession}</span>
      </TableRowCell>

      <TableRowCell className="w-[140px] gap-3 py-3 pl-3 pr-5">
        <span className={textCell}>{nextSession}</span>
      </TableRowCell>

      <TableRowCell className="w-[140px] gap-3 py-3 pl-3 pr-5">
        <span className={textCell}>{endDate}</span>
      </TableRowCell>

      <TableRowCell className="w-[140px] gap-3 py-3 pl-3 pr-5">
        <span className={textCell}>{lastCimtDate}</span>
      </TableRowCell>

      <TableRowCell className="w-[130px] gap-3 py-3 pl-3 pr-5">
        <span className={textCell}>{lastSleep}</span>
      </TableRowCell>

      <TableRowCell className="w-[160px] gap-2 p-3">
        {inflammationPanel != null && (
          <StatusBadge
            label={inflammationPanel ? "Complete" : "Incomplete"}
            variant={inflammationPanel ? "success" : "warning"}
          />
        )}
      </TableRowCell>

      <TableRowCell className="w-[140px] gap-3 py-3 pl-3 pr-5">
        <span className={textCell}>{lastOralDate}</span>
      </TableRowCell>

      <TableRowCell className="w-[150px] gap-3 py-3 pl-3 pr-5">
        <span className={textCell}>{insurance}</span>
      </TableRowCell>

      <TableRowCell className="w-[150px] gap-3 py-3 pl-3 pr-5">
        <span className={textCell}>{contractType}</span>
      </TableRowCell>

      <TableRowCell className="w-[160px] gap-3 py-3 pl-3 pr-5">
        <span className={textCell}>{contractExpiration}</span>
      </TableRowCell>
    </div>
  );
}

export { TableRow, TableRowCell, StatusBadge, badgeColorMap };
export type { TableRowProps, TableRowCellProps, StatusBadgeProps, BadgeVariant };
