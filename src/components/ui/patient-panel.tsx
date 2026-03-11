import * as React from "react";
import { X, EllipsisVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { FieldItem } from "@/components/ui/field-item";
import { PopoverMenu } from "@/components/ui/popover-menu";
import { StatusBadge } from "@/components/ui/table-row";
import type { PatientData } from "@/data/patients";

const panelMenuItems = [
  { label: "Research" },
  { label: "Prepare session" },
  { label: "Start session" },
  { label: "Schedule appointment" },
  { label: "Send reminders" },
];

interface PatientPanelProps {
  patient: PatientData | null;
  open: boolean;
  onClose: () => void;
}

function parseSubtitle(subtitle: string) {
  const parts = subtitle.split("·").map((s) => s.trim());
  return { age: parts[0] ?? "--", sex: parts[1] ?? "--" };
}

function PatientPanel({ patient, open, onClose }: PatientPanelProps) {
  const visible = open && patient !== null;
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!visible) setMenuOpen(false);
  }, [visible]);

  React.useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const { age, sex } = patient ? parseSubtitle(patient.subtitle) : { age: "--", sex: "--" };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 duration-300 ease-in-out",
          visible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-[480px] rounded-tl-(--radius-16) rounded-bl-(--radius-16) flex-col border-l border-stroke bg-bg-white shadow-xl transition-transform duration-300 ease-in-out",
          visible ? "translate-x-0" : "translate-x-full",
        )}
      >
        {patient && (
          <>
            {/* Header */}
            <div className="flex shrink-0 flex-col px-(--spacing-24) pt-(--spacing-24) pb-(--spacing-16)">
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="flex size-8 items-center justify-center rounded-(--radius-6) text-foreground transition-colors hover:bg-secondary-lighter cursor-pointer"
                >
                  <X className="size-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Button variant="stroke" color="secondary" size="sm">
                    View full profile
                  </Button>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen((prev) => !prev)}
                      className="flex size-8 items-center justify-center rounded-(--radius-6) text-foreground transition-colors hover:bg-secondary-lighter cursor-pointer"
                    >
                      <EllipsisVertical className="size-5" />
                    </button>
                    <PopoverMenu
                      open={menuOpen}
                      onClose={() => setMenuOpen(false)}
                      items={panelMenuItems}
                      className="top-10 right-0"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-(--spacing-16)">
                <h2 className="text-xl font-semibold leading-7 text-foreground">
                  {patient.name}
                </h2>
                <p className="text-sm leading-5 text-text-sub">
                  {patient.subtitle}
                </p>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {/* Overview */}
              <Accordion title="Overview">
                <FieldItem
                  label="Health status"
                  value={<StatusBadge label={patient.riskStatus.label} variant={patient.riskStatus.variant} />}
                />
                <FieldItem
                  label="Engagement"
                  value={<StatusBadge label={patient.priority.label} variant={patient.priority.variant} />}
                />
                <FieldItem label="Journey stage" value={patient.program} />
                <FieldItem label="Next appointment" value={patient.nextAppointment || "--"} />
                <FieldItem label="Last appointment" value={patient.lastAppointment || "--"} />
              </Accordion>

              {/* Basic information */}
              <Accordion title="Basic information">
                <FieldItem label="Age" value={age} />
                <FieldItem label="Sex" value={sex} />
                <FieldItem label="DOB" value="--" />
                <FieldItem label="Provider" value={patient.provider} />
                <FieldItem label="Insurance" value={patient.insurance} />
                <FieldItem label="Patient ID" value={patient.patientId} />
                <FieldItem label="PUID" value="--" />
              </Accordion>

              {/* Notes */}
              <Accordion title="Notes">
                <p className="text-sm leading-5 text-foreground">
                  --
                </p>
              </Accordion>

              {/* Contact information */}
              <Accordion title="Contact information">
                <FieldItem label="Email" value="--" />
                <FieldItem label="Phone" value="--" />
                <FieldItem label="Primary address" value="--" />
                <FieldItem label="Secondary address" value="--" />
                <FieldItem label="Timezone" value="--" />
              </Accordion>

              {/* Background & lifestyle */}
              <Accordion title="Background & lifestyle">
                <FieldItem label="Occupation" value="--" />
                <FieldItem label="Background" value="--" />
              </Accordion>

              {/* Labs */}
              <Accordion title="Labs">
                <FieldItem label="Last lab" value={patient.lastLab || "--"} />
                <FieldItem label="Last CIMT" value={patient.lastCimtDate || "--"} />
                <FieldItem label="Last sleep" value={patient.lastSleep || "--"} />
                <FieldItem label="Last oral" value={patient.lastOralDate || "--"} />
                <FieldItem
                  label="Inflammation panel"
                  value={patient.inflammationPanel ? "Complete" : "Incomplete"}
                />
              </Accordion>

              {/* Contract */}
              <Accordion title="Contract">
                <FieldItem label="Contract type" value={patient.contractType || "--"} />
                <FieldItem label="Contract renewal" value="--" />
                <FieldItem label="Contract date" value="--" />
                <FieldItem label="Contract expiration" value={patient.contractExpiration || "--"} />
                <FieldItem label="Paid?" value="--" />
                <FieldItem label="Insurance labs" value="--" />
              </Accordion>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export { PatientPanel };
export type { PatientPanelProps };
