
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { AppShell } from "@disb/components/layout/app-shell";
import { Button } from "@disb/components/ui/button";
import { Input } from "@disb/components/ui/input";
import { Label } from "@disb/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@disb/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@disb/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@disb/components/ui/radio-group";
import { useAppStore } from "@disb/lib/store";
import {
  PH_BANKS,
  getBankName,
  maskAccount,
  VERIFICATION_CONFIG,
  type BankCode,
  type VerificationStatus,
} from "@disb/lib/constants";
import { UserPlus, Search, Info } from "lucide-react";
import { formatUtcMediumDate } from "@disb/lib/date-display";
import { toast } from "sonner";
import { useFadeIn, useTableReveal } from "@disb/lib/use-gsap";
import type { Recipient } from "@disb/lib/mock-data";

const columnHelper = createColumnHelper<Recipient>();

const verificationStatuses: VerificationStatus[] = [
  "verified",
  "pending",
  "failed",
];

const verificationDot: Record<VerificationStatus, string> = {
  verified: "bg-[var(--color-success)]",
  pending: "bg-[var(--chart-2)]",
  failed: "bg-destructive",
};

function VerificationBadge({ status }: Readonly<{ status: VerificationStatus }>) {
  const config = VERIFICATION_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold leading-4 ${config.bgColor} ${config.color}`}
    >
      <span
        className={`size-[3px] shrink-0 rounded-full ring-1 ring-white/80 ${verificationDot[status]}`}
        aria-hidden
      />
      {config.label}
    </span>
  );
}

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => (
      <span className="font-medium text-foreground">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("bankCode", {
    header: "Bank",
    cell: (info) => (
      <span className="text-muted-foreground">{getBankName(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("accountNumber", {
    header: "Account",
    cell: (info) => (
      <span className="font-mono text-muted-foreground">
        {maskAccount(info.getValue())}
      </span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("lastUsed", {
    header: "Last Used",
    cell: (info) => {
      const val = info.getValue();
      return (
        <span className="text-muted-foreground">
          {val ? formatUtcMediumDate(val) : "Never"}
        </span>
      );
    },
    sortingFn: (a, b) => {
      const aVal = a.original.lastUsed?.getTime() ?? 0;
      const bVal = b.original.lastUsed?.getTime() ?? 0;
      return aVal - bVal;
    },
  }),
  columnHelper.accessor("verificationStatus", {
    header: "Verification",
    cell: (info) => <VerificationBadge status={info.getValue()} />,
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: () => (
      <span className="cursor-pointer text-xs font-semibold text-primary underline-offset-2 hover:underline">
        Edit
      </span>
    ),
  }),
];

function getSortIndicator(sorted: false | "asc" | "desc") {
  if (sorted === "asc") return " ↑";
  if (sorted === "desc") return " ↓";
  return null;
}

export default function RecipientsPage() {
  const recipients = useAppStore((s) => s.recipients);
  const addRecipient = useAppStore((s) => s.addRecipient);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [bankFilter, setBankFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [formName, setFormName] = useState("");
  const [formBank, setFormBank] = useState<string>("");
  const [formAccount, setFormAccount] = useState("");
  const [formAccountType, setFormAccountType] = useState<
    "savings" | "checking"
  >("savings");

  const filteredData = useMemo(() => {
    let data = recipients;
    if (bankFilter !== "all") {
      data = data.filter((r) => r.bankCode === bankFilter);
    }
    if (statusFilter !== "all") {
      data = data.filter((r) => r.verificationStatus === statusFilter);
    }
    return data;
  }, [recipients, bankFilter, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
  });

  function resetForm() {
    setFormName("");
    setFormBank("");
    setFormAccount("");
    setFormAccountType("savings");
  }

  function handleAddRecipient() {
    if (!formName.trim() || !formBank || !formAccount.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newRecipient: Recipient = {
      id: `RCP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      name: formName.trim(),
      bankCode: formBank as BankCode,
      accountNumber: formAccount.trim(),
      accountType: formAccountType,
      verificationStatus: "pending",
      lastUsed: null,
      createdAt: new Date(),
    };

    addRecipient(newRecipient);
    toast.success(
      "We'll verify this account before your next disbursement. This usually takes a few minutes."
    );
    resetForm();
    setSheetOpen(false);
  }

  const noResults = table.getRowModel().rows.length === 0;

  const filtersRef = useFadeIn<HTMLDivElement>({ y: 14 });
  const tableRef = useTableReveal<HTMLDivElement>();

  return (
    <AppShell title="Recipients">
      <div className="flex flex-col gap-6 sm:gap-8">
      <div ref={filtersRef} className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full min-w-0 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              placeholder="Search by name…"
              aria-label="Search by name"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-10 bg-white pl-10 text-foreground placeholder:text-muted-foreground border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <Select value={bankFilter} onValueChange={(val) => { if (val) setBankFilter(val); }}>
            <SelectTrigger
              aria-label="Bank filter"
              className="h-10 w-full min-w-[10rem] bg-white border-border rounded-xl text-foreground sm:w-[11rem]"
            >
              <SelectValue placeholder="All Banks" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="all">All Banks</SelectItem>
              {PH_BANKS.map((bank) => (
                <SelectItem key={bank.code} value={bank.code}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(val) => { if (val) setStatusFilter(val); }}>
            <SelectTrigger
              aria-label="Status filter"
              className="h-10 w-full min-w-[9rem] bg-white border-border rounded-xl text-foreground sm:w-[10rem]"
            >
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="all">All Status</SelectItem>
              {verificationStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {VERIFICATION_CONFIG[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="h-10 shrink-0 rounded-xl bg-primary px-5 text-white hover:bg-primary/90 transition-colors"
          onClick={() => setSheetOpen(true)}
        >
          <UserPlus className="mr-2 size-4" aria-hidden />
          Add
        </Button>
      </div>

      <div ref={tableRef} className="overflow-hidden rounded-2xl bg-white/70 border border-border/60 backdrop-blur-sm shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-secondary/70">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground select-none"
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {getSortIndicator(header.column.getIsSorted())}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-secondary/70 transition-colors hover:bg-secondary/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {noResults && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              No matches. Try another name or filter.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-secondary/30 p-4 sm:p-5">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Saved recipients mean faster payouts and fewer bank errors.
        </p>
      </div>
      </div>

      {/* Add Recipient Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="bg-white border-border overflow-y-auto"
        >
          <SheetHeader className="px-5 sm:px-6">
            <SheetTitle className="text-lg text-foreground">Add recipient</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-5 pb-6 pt-1 sm:px-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Name</Label>
              <Input
                placeholder="Recipient full name"
                aria-label="Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="h-11 bg-white border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Bank</Label>
              <Select value={formBank} onValueChange={(val) => { if (val) setFormBank(val); }}>
                <SelectTrigger
                  aria-label="Bank"
                  className="h-11 w-full bg-white border-border rounded-xl text-foreground"
                >
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent className="bg-white border-border">
                  {PH_BANKS.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Account Number</Label>
              <Input
                placeholder="Enter account number"
                aria-label="Account Number"
                value={formAccount}
                onChange={(e) => setFormAccount(e.target.value)}
                className="h-11 bg-white border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Account Type</Label>
              <RadioGroup
                value={formAccountType}
                onValueChange={(val: string) =>
                  setFormAccountType(val as "savings" | "checking")
                }
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="savings" aria-label="Savings" />
                  <Label className="cursor-pointer text-sm text-muted-foreground">
                    Savings
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="checking" aria-label="Checking" />
                  <Label className="cursor-pointer text-sm text-muted-foreground">
                    Checking
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button className="mt-4 h-11 w-full rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors" onClick={handleAddRecipient}>
              Save
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
