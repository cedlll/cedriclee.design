
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@disb/components/ui/sheet";
import { Button } from "@disb/components/ui/button";
import { StatusBadge } from "@disb/components/disbursements/status-badge";
import { StatusTimeline } from "@disb/components/disbursements/status-timeline";
import { formatPHP, maskAccount, getBankName } from "@disb/lib/constants";
import type { Disbursement } from "@disb/lib/mock-data";

interface DisbursementDrawerProps {
  disbursement: Disbursement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function DisbursementDrawer({
  disbursement,
  open,
  onOpenChange,
}: Readonly<DisbursementDrawerProps>) {
  if (!disbursement) return null;

  const isFailed = disbursement.status === "failed";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-border/60 bg-white sm:max-w-md"
      >
        <SheetHeader className="border-b border-secondary/70 px-5 pb-5 sm:px-6">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-lg text-foreground">
                {disbursement.recipientName}
              </SheetTitle>
              <p className="mt-1.5 font-mono text-[26px] font-bold tabular-nums text-foreground">
                {formatPHP(disbursement.amount)}
              </p>
            </div>
            <StatusBadge status={disbursement.status} size="md" />
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-8 p-5 sm:p-6">
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Timeline
            </h3>
            <StatusTimeline disbursement={disbursement} />
          </div>

          <div>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Details
            </h3>
            <div className="divide-y divide-secondary/70 rounded-2xl bg-secondary/70 px-4 py-1">
              <DetailRow
                label="Bank"
                value={getBankName(disbursement.bankCode)}
              />
              <DetailRow
                label="Account"
                value={maskAccount(disbursement.accountNumber)}
              />
              <DetailRow label="Reference" value={disbursement.reference} />
              <DetailRow label="Batch ID" value={disbursement.batchId} />
              <DetailRow
                label="Submitted by"
                value={disbursement.submittedBy}
              />
            </div>
          </div>

          {isFailed && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4">
              <p className="text-sm font-medium text-destructive">
                Disbursement Failed
              </p>
              {disbursement.failureReason && (
                <p className="mt-2 text-sm leading-relaxed text-destructive/80">
                  {disbursement.failureReason}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 rounded-xl bg-destructive text-white hover:bg-destructive/90"
                  render={<Link to="/disbursements/new" />}
                >
                  Edit &amp; Retry
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-muted-foreground hover:bg-border"
                  onClick={() => onOpenChange(false)}
                >
                  Mark as Resolved
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
