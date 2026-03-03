import { useState, useMemo, useEffect, useCallback } from "react";
import { ListFilter, ArrowUpDown, Columns3 } from "lucide-react";

import { SideNav } from "@/components/ui/side-nav";
import { ViewTabBar, type ViewTabItem } from "@/components/ui/view-tab-bar";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { TableHeader, type TableHeaderColumn } from "@/components/ui/table-header";
import { TableRow } from "@/components/ui/table-row";
import { Pagination } from "@/components/ui/pagination";
import { FilterPopup, type FilterCategory } from "@/components/ui/filter-popup";
import { CreateViewPopup } from "@/components/ui/create-view-popup";
import { patients, type PatientData } from "@/data/patients";

interface SavedView {
  id: string;
  name: string;
  filters: Record<string, string[]>;
}

const SAVED_VIEWS_KEY = "savedViews";

function loadSavedViews(): SavedView[] {
  try {
    const raw = localStorage.getItem(SAVED_VIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSavedViews(views: SavedView[]) {
  localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(views));
}

const tabs: ViewTabItem[] = [
  { label: "All patients", count: 40 },
];

const columnDefs: TableHeaderColumn[] = [
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

function getPatientValue(patient: PatientData, columnLabel: string): string {
  switch (columnLabel) {
    case "Patient name": return patient.name;
    case "Patient ID": return patient.patientId;
    case "Health status": return patient.riskStatus.label;
    case "Engagement": return patient.priority.label;
    case "Journey stage": return patient.program;
    case "Provider": return patient.provider;
    case "Next appointment": return patient.nextAppointment;
    case "Last appointment": return patient.lastAppointment;
    case "Last lab": return patient.lastLab;
    case "Last CIMT date": return patient.lastCimtDate;
    case "Last sleep": return patient.lastSleep;
    case "Inflammation panel": return patient.inflammationPanel ? "Complete" : "Incomplete";
    case "Last oral date": return patient.lastOralDate;
    case "Insurance": return patient.insurance;
    case "Contract type": return patient.contractType;
    case "Contract expiration": return patient.contractExpiration;
    default: return "";
  }
}

const NON_FILTERABLE_COLUMNS = new Set([
  "Patient name",
  "Patient ID",
  "Last CIMT date",
  "Last sleep",
  "Last oral date",
]);

function buildFilterCategories(): FilterCategory[] {
  return columnDefs
    .filter((col) => !NON_FILTERABLE_COLUMNS.has(col.label))
    .map((col) => {
      const uniqueValues = [
        ...new Set(patients.map((p) => getPatientValue(p, col.label))),
      ].sort();
      return { key: col.label, label: col.label, options: uniqueValues };
    });
}

const filterCategories = buildFilterCategories();
const ROWS_PER_PAGE = 11;

function filterPatients(filters: Record<string, string[]>): PatientData[] {
  const activeKeys = Object.keys(filters).filter(
    (k) => filters[k].length > 0,
  );
  if (activeKeys.length === 0) return patients;

  return patients.filter((patient) =>
    activeKeys.every((key) => {
      const value = getPatientValue(patient, key);
      return filters[key].includes(value);
    }),
  );
}

function PatientsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateViewOpen, setIsCreateViewOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [savedViews, setSavedViews] = useState<SavedView[]>(loadSavedViews);

  useEffect(() => {
    persistSavedViews(savedViews);
  }, [savedViews]);

  const filteredPatients = useMemo(
    () => filterPatients(activeFilters),
    [activeFilters],
  );

  const allTabs: ViewTabItem[] = useMemo(() => {
    const savedViewTabs: ViewTabItem[] = savedViews.map((view) => ({
      label: view.name,
      count: filterPatients(view.filters).length,
    }));
    return [...tabs, ...savedViewTabs];
  }, [savedViews]);

  const handleTabChange = useCallback(
    (index: number) => {
      setActiveTab(index);
      setCurrentPage(1);
      if (index >= tabs.length) {
        const view = savedViews[index - tabs.length];
        if (view) setActiveFilters(view.filters);
      } else {
        setActiveFilters({});
      }
    },
    [savedViews],
  );

  const handleCreateView = useCallback(
    (name: string, filters: Record<string, string[]>) => {
      const newView: SavedView = {
        id: crypto.randomUUID(),
        name,
        filters,
      };
      setSavedViews((prev) => {
        const next = [...prev, newView];
        setActiveTab(tabs.length + next.length - 1);
        return next;
      });
      setActiveFilters(filters);
      setCurrentPage(1);
      setIsCreateViewOpen(false);
    },
    [],
  );

  const existingViewNames = useMemo(
    () => savedViews.map((v) => v.name),
    [savedViews],
  );

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / ROWS_PER_PAGE));
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  const columns: TableHeaderColumn[] = columnDefs.map((col) => ({
    ...col,
    filtered: (activeFilters[col.label]?.length ?? 0) > 0,
  }));

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
            tabs={allTabs}
            activeIndex={activeTab}
            onTabChange={handleTabChange}
            onAddClick={() => setIsCreateViewOpen(true)}
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
                <Button
                  variant="stroke"
                  color="secondary"
                  size="sm"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <ListFilter className="text-[var(--color-icon-sub-800)]" />
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
                {paginatedPatients.map((patient, i) => (
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
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        <FilterPopup
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }}
          filterCategories={filterCategories}
          initialFilters={activeFilters}
        />
        <CreateViewPopup
          open={isCreateViewOpen}
          onClose={() => setIsCreateViewOpen(false)}
          onCreate={handleCreateView}
          filterCategories={filterCategories}
          existingViewNames={existingViewNames}
        />
      </main>
    </div>
  );
}

export default PatientsPage;
