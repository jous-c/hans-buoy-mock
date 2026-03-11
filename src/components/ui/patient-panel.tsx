import * as React from "react";
import { X, EllipsisVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { FieldItem } from "@/components/ui/field-item";
import { PopoverMenu } from "@/components/ui/popover-menu";
import { StatusBadge } from "@/components/ui/table-row";
import { useToast } from "@/components/ui/toast";
import type { PatientData } from "@/data/patients";

const panelMenuItems = [
  { label: "Research" },
  { label: "Prepare session" },
  { label: "Start session" },
  { label: "Schedule appointment" },
  { label: "Send reminders" },
];

const JOURNEY_STAGE_OPTIONS = [
  "Foundational Support",
  "Chronic Care",
  "Behavioral Health",
];

const TIMEZONE_OPTIONS = [
  "Eastern Standard Time (EST)",
  "Mountain Standard Time (MST)",
  "Pacific Standard Time (PST)",
  "Central Standard Time (CST)",
];

const SEX_OPTIONS = ["Male", "Female", "Non-binary"];

const PROVIDER_OPTIONS = ["Dr. Mewborn", "Dr. Patel", "Dr. Singh"];

const INFLAMMATION_OPTIONS = ["Incomplete", "Complete", "In Progress"];

const CONTRACT_TYPE_OPTIONS = ["Monthly", "Quarterly", "Annually", "Bi-annually"];

const YES_NO_OPTIONS = ["Yes", "No"];

interface PatientPanelProps {
  patient: PatientData | null;
  open: boolean;
  onClose: () => void;
  onUpdateField?: (patientId: string, field: string, value: string) => void;
}

function parseSubtitle(subtitle: string) {
  const parts = subtitle.split("·").map((s) => s.trim());
  return { age: parts[0] ?? "--", sex: parts[1] ?? "--" };
}

function PatientPanel({ patient, open, onClose, onUpdateField }: PatientPanelProps) {
  const visible = open && patient !== null;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { showToast } = useToast();

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

  const handleSave = React.useCallback(
    (field: string) => (newValue: string) => {
      if (patient) {
        onUpdateField?.(patient.patientId, field, newValue);
        showToast(`${field} updated successfully`);
      }
    },
    [patient, onUpdateField, showToast],
  );

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
                <FieldItem
                  label="Journey stage"
                  value={patient.program}
                  editable
                  editType="dropdown"
                  options={JOURNEY_STAGE_OPTIONS}
                  onSave={handleSave("Journey stage")}
                />
                <FieldItem
                  label="Next appointment"
                  value={patient.nextAppointment || "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Next appointment")}
                />
                <FieldItem
                  label="Last appointment"
                  value={patient.lastAppointment || "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Last appointment")}
                />
              </Accordion>

              {/* Basic information */}
              <Accordion title="Basic information">
                <FieldItem
                  label="Age"
                  value={patient.age ?? age}
                  editable
                  editType="input"
                  onSave={handleSave("Age")}
                />
                <FieldItem
                  label="Sex"
                  value={patient.sex ?? sex}
                  editable
                  editType="dropdown"
                  options={SEX_OPTIONS}
                  onSave={handleSave("Sex")}
                />
                <FieldItem
                  label="DOB"
                  value={patient.dob ?? "--"}
                  editable
                  editType="input"
                  onSave={handleSave("DOB")}
                />
                <FieldItem
                  label="Provider"
                  value={patient.provider}
                  editable
                  editType="dropdown"
                  options={PROVIDER_OPTIONS}
                  onSave={handleSave("Provider")}
                />
                <FieldItem
                  label="Insurance"
                  value={patient.insurance}
                  editable
                  editType="input"
                  onSave={handleSave("Insurance")}
                />
                <FieldItem label="Patient ID" value={patient.patientId} />
                <FieldItem label="PUID" value="--" />
              </Accordion>

              {/* Notes */}
              <Accordion title="Notes">
                <FieldItem
                  label="Notes"
                  value={patient.notes ?? "--"}
                  editable
                  editType="textarea"
                  maxLength={300}
                  onSave={handleSave("Notes")}
                />
              </Accordion>

              {/* Contact information */}
              <Accordion title="Contact information">
                <FieldItem
                  label="Email"
                  value={patient.email ?? "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Email")}
                />
                <FieldItem
                  label="Phone"
                  value={patient.phone ?? "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Phone")}
                />
                <FieldItem
                  label="Primary address"
                  value={patient.primaryAddress ?? "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Primary address")}
                />
                <FieldItem
                  label="Secondary address"
                  value={patient.secondaryAddress ?? "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Secondary address")}
                />
                <FieldItem
                  label="Timezone"
                  value={patient.timezone ?? "--"}
                  editable
                  editType="dropdown"
                  options={TIMEZONE_OPTIONS}
                  onSave={handleSave("Timezone")}
                />
              </Accordion>

              {/* Background & lifestyle */}
              <Accordion title="Background & lifestyle">
                <FieldItem
                  label="Occupation"
                  value={patient.occupation ?? "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Occupation")}
                />
                <FieldItem
                  label="Background"
                  value={patient.background ?? "--"}
                  editable
                  editType="textarea"
                  maxLength={300}
                  onSave={handleSave("Background")}
                />
              </Accordion>

              {/* Labs */}
              <Accordion title="Labs">
                <FieldItem
                  label="Last lab"
                  value={patient.lastLab || "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Last lab")}
                />
                <FieldItem
                  label="Last CIMT"
                  value={patient.lastCimtDate || "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Last CIMT")}
                />
                <FieldItem
                  label="Last sleep"
                  value={patient.lastSleep || "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Last sleep")}
                />
                <FieldItem
                  label="Last oral"
                  value={patient.lastOralDate || "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Last oral")}
                />
                <FieldItem
                  label="Inflammation panel"
                  value={patient.inflammationPanelLabel ?? (patient.inflammationPanel ? "Complete" : "Incomplete")}
                  editable
                  editType="dropdown"
                  options={INFLAMMATION_OPTIONS}
                  onSave={handleSave("Inflammation panel")}
                />
              </Accordion>

              {/* Contract */}
              <Accordion title="Contract">
                <FieldItem
                  label="Contract type"
                  value={patient.contractType || "--"}
                  editable
                  editType="dropdown"
                  options={CONTRACT_TYPE_OPTIONS}
                  onSave={handleSave("Contract type")}
                />
                <FieldItem
                  label="Contract renewal"
                  value={patient.contractRenewal ?? "--"}
                  editable
                  editType="dropdown"
                  options={YES_NO_OPTIONS}
                  onSave={handleSave("Contract renewal")}
                />
                <FieldItem
                  label="Contract date"
                  value={patient.contractDate ?? "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Contract date")}
                />
                <FieldItem
                  label="Contract expiration"
                  value={patient.contractExpiration || "--"}
                  editable
                  editType="input"
                  onSave={handleSave("Contract expiration")}
                />
                <FieldItem
                  label="Paid?"
                  value={patient.paid ?? "--"}
                  editable
                  editType="dropdown"
                  options={YES_NO_OPTIONS}
                  onSave={handleSave("Paid?")}
                />
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
