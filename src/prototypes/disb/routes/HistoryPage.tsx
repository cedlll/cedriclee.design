
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  formatUtcCsvDate,
  formatUtcCsvDateTime,
  formatUtcShortDateTime,
} from "@disb/lib/date-display";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

import { AppShell } from "@disb/components/layout/app-shell";
import { StatusBadge } from "@disb/components/disbursements/status-badge";
import { Button } from "@disb/components/ui/button";
import { Input } from "@disb/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@disb/components/ui/select";
import { useAppStore } from "@disb/lib/store";
import { formatPHP, getBankName } from "@disb/lib/constants";
import { useFadeIn, useTableReveal } from "@disb/lib/use-gsap";
import type { Disbursement } from "@disb/lib/mock-data";

const columnHelper = createColumnHelper<Disbursement>();

const columns = [
  columnHelper.accessor("submittedAt", {
    header: "Submitted (UTC)",
    cell: (info) => (
      <span className="whitespace-nowrap text-foreground">
        {formatUtcShortDateTime(info.getValue())}
      </span>
    ),
    sortingFn: "datetime",
  }),
  columnHelper.accessor("recipientName", {
    header: "Recipient",
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
  columnHelper.accessor("amount", {
    header: () => (
      <span className="block text-right">Amount</span>
    ),
    cell: (info) => (
      <span className="block font-mono text-sm font-semibold text-right tabular-nums text-foreground">
        {formatPHP(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("reference", {
    header: "Reference",
    cell: (info) => (
      <span className="font-mono text-xs text-muted-foreground">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    header: () => (
      <span className="block w-full text-right">Status</span>
    ),
    cell: (info) => (
      <div className="flex justify-end">
        <StatusBadge status={info.getValue()} />
      </div>
    ),
    enableSorting: false,
  }),
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "queued", label: "Queued" },
  { value: "processing", label: "Processing" },
  { value: "in_transit", label: "In Transit" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

function exportCSV(data: Disbursement[]) {
  const headers = [
    "Date",
    "Recipient",
    "Bank",
    "Account Number",
    "Amount",
    "Status",
    "Reference",
    "Batch ID",
    "Submitted At",
    "Processing At",
    "In Transit At",
    "Completed At",
  ];

  const rows = data.map((d) => [
    formatUtcCsvDate(d.submittedAt),
    d.recipientName,
    getBankName(d.bankCode),
    d.accountNumber,
    d.amount.toFixed(2),
    d.status,
    d.reference,
    d.batchId,
    formatUtcCsvDateTime(d.submittedAt),
    d.processingAt ? formatUtcCsvDateTime(d.processingAt) : "",
    d.inTransitAt ? formatUtcCsvDateTime(d.inTransitAt) : "",
    d.completedAt ? formatUtcCsvDateTime(d.completedAt) : "",
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((r) => r.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `disbursements-${formatUtcCsvDate(new Date())}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { disbursements } = useAppStore();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [recipientSearch, setRecipientSearch] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");

  const filteredData = useMemo(() => {
    return disbursements.filter((d) => {
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (d.submittedAt < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (d.submittedAt > to) return false;
      }
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (
        recipientSearch &&
        !d.recipientName.toLowerCase().includes(recipientSearch.toLowerCase())
      )
        return false;
      if (amountMin && d.amount < Number(amountMin)) return false;
      if (amountMax && d.amount > Number(amountMax)) return false;
      return true;
    });
  }, [disbursements, dateFrom, dateTo, statusFilter, recipientSearch, amountMin, amountMax]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
      sorting: [{ id: "submittedAt", desc: true }],
    },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const filtersRef = useFadeIn<HTMLDivElement>({ y: 14 });
  const tableRef = useTableReveal<HTMLDivElement>();

  return (
    <AppShell title="History">
      <div className="flex flex-col gap-8">
      <div ref={filtersRef} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:flex xl:flex-wrap xl:items-end">
        <div className="min-w-0">
          <label htmlFor="filter-date-from" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            From
          </label>
          <Input
            id="filter-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-10 w-full min-w-0 bg-white border border-border rounded-xl text-foreground sm:max-w-[9.5rem]"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="filter-date-to" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            To
          </label>
          <Input
            id="filter-date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-10 w-full min-w-0 bg-white border border-border rounded-xl text-foreground sm:max-w-[9.5rem]"
          />
        </div>
        <div className="min-w-0 sm:col-span-2 lg:col-span-1">
          <label htmlFor="filter-status" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Status
          </label>
          <Select
            value={statusFilter}
            onValueChange={(val) => { if (val) setStatusFilter(val); }}
          >
            <SelectTrigger
              id="filter-status"
              aria-label="Status"
              className="h-10 w-full bg-white border border-border rounded-xl text-foreground sm:w-44"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border">
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 min-w-0 sm:col-span-3 lg:col-span-2 xl:col-span-1 xl:min-w-[12rem]">
          <label htmlFor="filter-recipient" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Recipient
          </label>
          <Input
            id="filter-recipient"
            placeholder="Search…"
            value={recipientSearch}
            onChange={(e) => setRecipientSearch(e.target.value)}
            className="h-10 w-full bg-white border border-border rounded-xl text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="filter-amount-min" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Min ₱
          </label>
          <Input
            id="filter-amount-min"
            type="number"
            placeholder="0"
            value={amountMin}
            onChange={(e) => setAmountMin(e.target.value)}
            className="h-10 w-full bg-white border border-border rounded-xl text-foreground sm:max-w-[7rem]"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="filter-amount-max" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Max ₱
          </label>
          <Input
            id="filter-amount-max"
            type="number"
            placeholder="∞"
            value={amountMax}
            onChange={(e) => setAmountMax(e.target.value)}
            className="h-10 w-full bg-white border border-border rounded-xl text-foreground sm:max-w-[7rem]"
          />
        </div>
        <div className="col-span-2 flex items-end sm:col-span-3 lg:col-span-4 xl:col-span-1 xl:ml-auto xl:flex-1 xl:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => exportCSV(filteredData)}
          className="h-10 w-full rounded-xl border-border bg-secondary text-foreground hover:bg-border transition-colors sm:w-auto sm:px-5"
        >
          <Download className="mr-2 size-4" aria-hidden />
          Export CSV
        </Button>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Newest submissions appear first. Dates and times use UTC.
      </p>

      <div ref={tableRef} className="overflow-x-auto rounded-2xl bg-white/70 border border-border/60 backdrop-blur-sm shadow-card">
        <table className="w-full min-w-[800px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-secondary/70"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${
                      header.column.id === "status"
                        ? "text-right"
                        : "text-left"
                    } ${
                      header.column.getCanSort()
                        ? "cursor-pointer select-none hover:text-foreground"
                        : ""
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getIsSorted() === "asc" && " ↑"}
                    {header.column.getIsSorted() === "desc" && " ↓"}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-sm leading-relaxed text-muted-foreground"
                >
                  No transactions match your filters. Try adjusting the date
                  range.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  tabIndex={0}
                  className="cursor-pointer border-b border-secondary/70 transition-colors last:border-b-0 hover:bg-secondary/40"
                  aria-label={`Open disbursement for ${row.original.recipientName}`}
                  onClick={() =>
                    navigate(`/disbursements/${row.original.id}`)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/disbursements/${row.original.id}`);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-5 py-4 text-sm ${
                        cell.column.id === "status" ? "text-right" : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {totalRows === 0
            ? "No rows match your filters."
            : `Showing rows ${startRow}–${endRow} of ${totalRows} (${pageSize} per page)`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            className="text-muted-foreground hover:bg-border disabled:opacity-30"
          >
            <ChevronLeft className="mr-1 h-3.5 w-3.5" />
            Prev
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground">
            Page {pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            className="text-muted-foreground hover:bg-border disabled:opacity-30"
          >
            Next
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      </div>
    </AppShell>
  );
}
