
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Wallet,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { AppShell } from "@disb/components/layout/app-shell";
import { StatusBadge } from "@disb/components/disbursements/status-badge";
import { DisbursementDrawer } from "@disb/components/disbursements/disbursement-drawer";
import { Button } from "@disb/components/ui/button";

import { useAppStore } from "@disb/lib/store";
import {
  formatUtcMediumDate,
  formatUtcMonthToDateThrough,
  formatUtcShortDateTime,
} from "@disb/lib/date-display";
import {
  getMonthlyTotal,
  getPendingCount,
  getFailedCount,
  MOCK_NOW,
} from "@disb/lib/mock-data";
import { formatPHP } from "@disb/lib/constants";
import { useStaggerReveal, useTableReveal } from "@disb/lib/use-gsap";
import type { Disbursement } from "@disb/lib/mock-data";

const RECENT_PAGE_SIZE = 10;

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  subtitle: string;
  icon: React.ReactNode;
}

function StatCard({
  label,
  value,
  change,
  changeType,
  subtitle,
  icon,
}: Readonly<StatCardProps>) {
  let changeBg = "bg-[var(--color-success-light)] text-primary";
  if (changeType === "negative") {
    changeBg = "bg-[var(--color-danger-light)] text-destructive";
  } else if (changeType === "neutral") {
    changeBg = "bg-secondary text-muted-foreground";
  }

  let TrendIcon: typeof TrendingUp | typeof TrendingDown | null = TrendingUp;
  if (changeType === "negative") {
    TrendIcon = TrendingDown;
  } else if (changeType === "neutral") {
    TrendIcon = null;
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-col justify-between rounded-2xl border border-border bg-white p-4 transition-shadow duration-200 hover:shadow-card-hover sm:p-5 md:p-6">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <p className="min-w-0 flex-1 text-[10px] font-semibold uppercase leading-tight tracking-wider text-muted-foreground sm:text-[11px]">
          {label}
        </p>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary sm:size-9">
          {icon}
        </span>
      </div>

      <div className="mt-3 min-w-0 sm:mt-4">
        <p className="min-w-0 font-mono text-sm font-bold leading-tight tracking-tight tabular-nums text-foreground sm:text-base sm:leading-none md:text-lg lg:text-xl xl:text-2xl">
          {value}
        </p>
        <span
          className={`mt-2 inline-flex max-w-full items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold leading-tight sm:max-w-[11rem] sm:text-[11px] ${changeBg}`}
        >
          {TrendIcon ? (
            <TrendIcon className="size-3 shrink-0" aria-hidden />
          ) : null}
          <span className="min-w-0 whitespace-normal text-pretty break-words text-left">
            {change}
          </span>
        </span>
        <p className="mt-2 min-w-0 text-pretty text-[11px] leading-snug text-muted-foreground sm:mt-2.5 sm:text-xs sm:leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { disbursements, balance } = useAppStore();
  const [selectedDisbursement, setSelectedDisbursement] =
    useState<Disbursement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [recentPage, setRecentPage] = useState(0);

  const monthlyTotal = getMonthlyTotal();
  const pending = getPendingCount();
  const failed = getFailedCount();

  const sortedRecent = useMemo(
    () =>
      [...disbursements].sort(
        (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime(),
      ),
    [disbursements],
  );

  const recentTotal = sortedRecent.length;
  const recentPageCount = Math.max(
    1,
    Math.ceil(recentTotal / RECENT_PAGE_SIZE),
  );
  const recentPageSafe = Math.min(recentPage, recentPageCount - 1);
  const recentStart = recentTotal === 0 ? 0 : recentPageSafe * RECENT_PAGE_SIZE + 1;
  const recentEnd = Math.min(
    (recentPageSafe + 1) * RECENT_PAGE_SIZE,
    recentTotal,
  );
  const recentDisbursements = sortedRecent.slice(
    recentPageSafe * RECENT_PAGE_SIZE,
    recentPageSafe * RECENT_PAGE_SIZE + RECENT_PAGE_SIZE,
  );

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(recentTotal / RECENT_PAGE_SIZE) - 1);
    setRecentPage((p) => Math.min(p, maxPage));
  }, [recentTotal]);

  const cardsRef = useStaggerReveal<HTMLDivElement>({ y: 20, stagger: 0.1 });
  const tableRef = useTableReveal<HTMLDivElement>();

  const disbursedCoverage = formatUtcMonthToDateThrough(MOCK_NOW);
  const snapshotCoverage = formatUtcMediumDate(MOCK_NOW);

  let failedCaption: string;
  if (failed.count === 0) failedCaption = "All clear";
  else if (failed.count === 1) failedCaption = "1 needs action";
  else failedCaption = `${failed.count} need action`;

  function openDrawer(d: Disbursement) {
    setSelectedDisbursement(d);
    setDrawerOpen(true);
  }

  return (
    <AppShell title="Dashboard">
      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
        <div ref={cardsRef} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            label="Disbursed"
            value={formatPHP(monthlyTotal)}
            change="10.5%"
            changeType="positive"
            subtitle={disbursedCoverage}
            icon={<ArrowUpRight className="size-[18px] text-primary" />}
          />
          <StatCard
            label="Available"
            value={formatPHP(balance.available)}
            change="13.5%"
            changeType="positive"
            subtitle={snapshotCoverage}
            icon={<Wallet className="size-[18px] text-primary" />}
          />
          <StatCard
            label="In transit"
            value={formatPHP(pending.total)}
            change={`${pending.count} payout${pending.count === 1 ? "" : "s"}`}
            changeType="neutral"
            subtitle={snapshotCoverage}
            icon={<Clock className="size-[18px] text-primary" />}
          />
          <StatCard
            label="Failed"
            value={formatPHP(failed.total)}
            change={failedCaption}
            changeType={failed.count > 0 ? "negative" : "positive"}
            subtitle={snapshotCoverage}
            icon={<AlertCircle className="size-[18px] text-primary" />}
          />
        </div>

        <section>
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:mb-5">
            Recent activity
          </h2>
          <div ref={tableRef} className="overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full min-w-[36rem]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Recipient
                  </th>
                  <th className="hidden px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                    Submitted (UTC)
                  </th>
                  <th className="hidden px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                    Est. done (UTC)
                  </th>
                  <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentDisbursements.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-muted-foreground"
                    >
                      No disbursements yet.
                    </td>
                  </tr>
                ) : (
                  recentDisbursements.map((d) => (
                    <tr
                      key={d.id}
                      className="cursor-pointer border-b border-secondary transition-colors last:border-b-0 hover:bg-secondary/40"
                      onClick={() => openDrawer(d)}
                    >
                      <td className="px-5 py-3.5 text-sm font-medium text-foreground">
                        {d.recipientName}
                      </td>
                      <td className="hidden px-5 py-3.5 text-sm text-muted-foreground sm:table-cell">
                        {formatUtcShortDateTime(d.submittedAt)}
                      </td>
                      <td className="hidden px-5 py-3.5 text-sm text-muted-foreground md:table-cell">
                        {formatUtcShortDateTime(d.estimatedCompletion)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-sm font-semibold tabular-nums text-foreground">
                        {formatPHP(d.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end">
                          <StatusBadge status={d.status} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {recentTotal > 0 ? (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing rows {recentStart}–{recentEnd} of {recentTotal}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={recentPageSafe <= 0}
                  onClick={() => setRecentPage((p) => Math.max(0, p - 1))}
                  className="text-muted-foreground hover:bg-border disabled:opacity-30"
                >
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                  Prev
                </Button>
                <span className="text-xs tabular-nums text-muted-foreground">
                  Page {recentPageSafe + 1} of {recentPageCount}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={recentPageSafe >= recentPageCount - 1}
                  onClick={() =>
                    setRecentPage((p) =>
                      Math.min(recentPageCount - 1, p + 1),
                    )
                  }
                  className="text-muted-foreground hover:bg-border disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <DisbursementDrawer
        disbursement={selectedDisbursement}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </AppShell>
  );
}
