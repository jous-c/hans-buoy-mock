import { useState } from "react";
import { ListFilter, ArrowUpDown, Columns3 } from "lucide-react";

import { SideNav } from "@/components/ui/side-nav";
import { ViewTabBar, type ViewTabItem } from "@/components/ui/view-tab-bar";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { TableHeader, type TableHeaderColumn } from "@/components/ui/table-header";
import { TableRow, type BadgeVariant } from "@/components/ui/table-row";
import { Pagination } from "@/components/ui/pagination";

const tabs: ViewTabItem[] = [
  { label: "All patients", count: 42 },
  { label: "Health at risk", count: 12 },
  { label: "Low engagement patients", count: 12 },
  { label: "Elderly patients", count: 12 },
  { label: "New patients", count: 12 },
  { label: "Early stage patients", count: 12 },
];

const columns: TableHeaderColumn[] = [
  { label: "Patient name", width: 220, sortable: true },
  { label: "Patient ID", width: 120 },
  { label: "Health status", width: 150 },
  { label: "Engagement", width: 150 },
  { label: "Journey stage", width: 240 },
  { label: "Provider", width: 140 },
  { label: "Next appointment", width: 140 },
  { label: "Last appointment", width: 140 },
  { label: "Last lab", width: 140 },
  { label: "Last CIMT date", width: 140 },
  { label: "Last sleep", width: 130 },
  { label: "Inflammation panel", width: 160 },
  { label: "Last oral date", width: 140 },
  { label: "Insurance", width: 150 },
  { label: "Contract type", width: 150 },
  { label: "Contract expiration", width: 160 },
];

type PatientData = {
  name: string;
  subtitle: string;
  patientId: string;
  riskStatus: { label: string; variant: BadgeVariant };
  priority: { label: string; variant: BadgeVariant };
  program: string;
  provider: string;
  nextAppointment: string;
  lastAppointment: string;
  lastLab: string;
  lastCimtDate: string;
  lastSleep: string;
  inflammationPanel: boolean;
  lastOralDate: string;
  insurance: string;
  contractType: string;
  contractExpiration: string;
};

const patients: PatientData[] = [
  {
    name: "Amanda Lee",
    subtitle: "34 · Female",
    patientId: "PT-10042",
    riskStatus: { label: "At risk", variant: "error" },
    priority: { label: "High", variant: "faded" },
    program: "Foundational Support",
    provider: "Dr. Mewborn",
    nextAppointment: "08/08/2028",
    lastAppointment: "08/08/2028",
    lastLab: "08/20/2028",
    lastCimtDate: "07/15/2028",
    lastSleep: "08/01/2028",
    inflammationPanel: true,
    lastOralDate: "06/20/2028",
    insurance: "Aetna PPO",
    contractType: "Annual",
    contractExpiration: "12/31/2028",
  },
  {
    name: "James Carter",
    subtitle: "58 · Male",
    patientId: "PT-10078",
    riskStatus: { label: "Stable", variant: "success" },
    priority: { label: "Medium", variant: "faded" },
    program: "Chronic Care",
    provider: "Dr. Patel",
    nextAppointment: "09/12/2028",
    lastAppointment: "07/15/2028",
    lastLab: "07/20/2028",
    lastCimtDate: "05/10/2028",
    lastSleep: "07/05/2028",
    inflammationPanel: false,
    lastOralDate: "04/18/2028",
    insurance: "Blue Cross",
    contractType: "Quarterly",
    contractExpiration: "09/30/2028",
  },
  {
    name: "Sofia Rodriguez",
    subtitle: "27 · Female",
    patientId: "PT-10103",
    riskStatus: { label: "At risk", variant: "error" },
    priority: { label: "High", variant: "faded" },
    program: "Foundational Support",
    provider: "Dr. Mewborn",
    nextAppointment: "08/10/2028",
    lastAppointment: "08/01/2028",
    lastLab: "08/05/2028",
    lastCimtDate: "07/20/2028",
    lastSleep: "07/28/2028",
    inflammationPanel: true,
    lastOralDate: "07/01/2028",
    insurance: "UnitedHealth",
    contractType: "Annual",
    contractExpiration: "03/15/2029",
  },
  {
    name: "Michael Chen",
    subtitle: "45 · Male",
    patientId: "PT-10045",
    riskStatus: { label: "Moderate", variant: "warning" },
    priority: { label: "Medium", variant: "faded" },
    program: "Behavioral Health",
    provider: "Dr. Singh",
    nextAppointment: "08/22/2028",
    lastAppointment: "07/28/2028",
    lastLab: "07/30/2028",
    lastCimtDate: "06/12/2028",
    lastSleep: "07/18/2028",
    inflammationPanel: false,
    lastOralDate: "05/22/2028",
    insurance: "Cigna HMO",
    contractType: "Monthly",
    contractExpiration: "08/31/2028",
  },
  {
    name: "Emily Watson",
    subtitle: "62 · Female",
    patientId: "PT-10091",
    riskStatus: { label: "Stable", variant: "success" },
    priority: { label: "Low", variant: "faded" },
    program: "Chronic Care",
    provider: "Dr. Patel",
    nextAppointment: "09/05/2028",
    lastAppointment: "08/02/2028",
    lastLab: "08/10/2028",
    lastCimtDate: "07/01/2028",
    lastSleep: "07/25/2028",
    inflammationPanel: true,
    lastOralDate: "06/15/2028",
    insurance: "Medicare",
    contractType: "Annual",
    contractExpiration: "12/31/2028",
  },
  {
    name: "David Kim",
    subtitle: "39 · Male",
    patientId: "PT-10112",
    riskStatus: { label: "At risk", variant: "error" },
    priority: { label: "High", variant: "faded" },
    program: "Foundational Support",
    provider: "Dr. Mewborn",
    nextAppointment: "08/08/2028",
    lastAppointment: "08/08/2028",
    lastLab: "08/20/2028",
    lastCimtDate: "07/10/2028",
    lastSleep: "08/02/2028",
    inflammationPanel: true,
    lastOralDate: "06/28/2028",
    insurance: "Aetna PPO",
    contractType: "Quarterly",
    contractExpiration: "09/30/2028",
  },
  {
    name: "Rachel Green",
    subtitle: "51 · Female",
    patientId: "PT-10067",
    riskStatus: { label: "Moderate", variant: "warning" },
    priority: { label: "Medium", variant: "faded" },
    program: "Behavioral Health",
    provider: "Dr. Singh",
    nextAppointment: "08/18/2028",
    lastAppointment: "07/25/2028",
    lastLab: "08/01/2028",
    lastCimtDate: "06/05/2028",
    lastSleep: "07/20/2028",
    inflammationPanel: false,
    lastOralDate: "05/30/2028",
    insurance: "Blue Cross",
    contractType: "Annual",
    contractExpiration: "06/30/2029",
  },
  {
    name: "Thomas Brown",
    subtitle: "73 · Male",
    patientId: "PT-10023",
    riskStatus: { label: "At risk", variant: "error" },
    priority: { label: "High", variant: "faded" },
    program: "Chronic Care",
    provider: "Dr. Patel",
    nextAppointment: "08/14/2028",
    lastAppointment: "08/05/2028",
    lastLab: "08/12/2028",
    lastCimtDate: "07/22/2028",
    lastSleep: "08/01/2028",
    inflammationPanel: true,
    lastOralDate: "07/08/2028",
    insurance: "Medicare",
    contractType: "Annual",
    contractExpiration: "12/31/2028",
  },
  {
    name: "Lisa Nguyen",
    subtitle: "29 · Female",
    patientId: "PT-10134",
    riskStatus: { label: "Stable", variant: "success" },
    priority: { label: "Low", variant: "faded" },
    program: "Foundational Support",
    provider: "Dr. Mewborn",
    nextAppointment: "09/01/2028",
    lastAppointment: "08/03/2028",
    lastLab: "08/15/2028",
    lastCimtDate: "06/18/2028",
    lastSleep: "07/30/2028",
    inflammationPanel: false,
    lastOralDate: "06/01/2028",
    insurance: "UnitedHealth",
    contractType: "Monthly",
    contractExpiration: "09/01/2028",
  },
  {
    name: "Robert Martinez",
    subtitle: "48 · Male",
    patientId: "PT-10056",
    riskStatus: { label: "At risk", variant: "error" },
    priority: { label: "High", variant: "faded" },
    program: "Behavioral Health",
    provider: "Dr. Singh",
    nextAppointment: "08/11/2028",
    lastAppointment: "08/06/2028",
    lastLab: "08/18/2028",
    lastCimtDate: "07/28/2028",
    lastSleep: "08/04/2028",
    inflammationPanel: true,
    lastOralDate: "07/12/2028",
    insurance: "Cigna HMO",
    contractType: "Quarterly",
    contractExpiration: "12/31/2028",
  },
];

function PatientsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-weak-50)]">
      <SideNav
        defaultExpanded={false}
        activeLabel="Patients"
        className="shrink-0 border-r border-stroke"
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Page header */}
        <div className="flex shrink-0 items-center justify-between px-(--spacing-24) pt-(--spacing-24) pb-(--spacing-16)">
          <h1 className="text-2xl font-semibold leading-8 tracking-tight text-foreground">
            Patients
          </h1>
          <Button variant="filled" color="primary" size="md">
            Add patient
          </Button>
        </div>

        {/* View tab bar */}
        <div className="shrink-0 px-(--spacing-24) pb-(--spacing-16)">
          <ViewTabBar
            tabs={tabs}
            activeIndex={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Toolbar + Data table */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col px-(--spacing-24)">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-(--radius-12) border border-stroke">
            {/* Toolbar -- fixed */}
            <div className="flex shrink-0 items-center justify-between bg-(--alpha-brown-10) px-(--spacing-12) py-(--spacing-8)">
              <InputField
                placeholder="Search..."
                className="w-[220px]"
              />
              <div className="flex items-center gap-2">
                <Button variant="stroke" color="secondary" size="sm">
                  <ListFilter />
                  Filter
                </Button>
                <Button variant="stroke" color="secondary" size="sm">
                  <ArrowUpDown />
                  Sort
                </Button>
                <Button variant="stroke" color="secondary" size="sm">
                  <Columns3 />
                  Manage columns
                </Button>
              </div>
            </div>

            {/* Table header + rows -- scrollable */}
            <div className="min-h-0 flex-1 overflow-auto">
              <div className="min-w-[2460px]">
                <TableHeader columns={columns} className="sticky top-0 z-10" />
                {patients.map((patient, i) => (
                  <TableRow
                    key={i}
                    name={patient.name}
                    subtitle={patient.subtitle}
                    patientId={patient.patientId}
                    riskStatus={patient.riskStatus}
                    priority={patient.priority}
                    program={patient.program}
                    provider={patient.provider}
                    lastSession={patient.nextAppointment}
                    nextSession={patient.lastAppointment}
                    endDate={patient.lastLab}
                    lastCimtDate={patient.lastCimtDate}
                    lastSleep={patient.lastSleep}
                    inflammationPanel={patient.inflammationPanel}
                    lastOralDate={patient.lastOralDate}
                    insurance={patient.insurance}
                    contractType={patient.contractType}
                    contractExpiration={patient.contractExpiration}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination -- fixed */}
        <div className="shrink-0 border-t border-stroke px-(--spacing-24) py-(--spacing-16)">
          <Pagination
            currentPage={currentPage}
            totalPages={16}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
}

export default PatientsPage;
