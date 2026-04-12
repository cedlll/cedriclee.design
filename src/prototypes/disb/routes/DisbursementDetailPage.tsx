
import { AppShell } from "@disb/components/layout/app-shell";
import { StatusBadge } from "@disb/components/disbursements/status-badge";
import { StatusTimeline } from "@disb/components/disbursements/status-timeline";
import { Button } from "@disb/components/ui/button";
import { useAppStore } from "@disb/lib/store";
import { formatPHP, maskAccount, getBankName } from "@disb/lib/constants";
import { useFadeIn, useStaggerReveal } from "@disb/lib/use-gsap";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function DisbursementDetailPage() {
  const params = useParams();
  const disbursements = useAppStore((s) => s.disbursements);
  const updateDisbursement = useAppStore((s) => s.updateDisbursement);

  const id = params.id as string | undefined;
  const disbursement = id ? disbursements.find((d) => d.id === id) : undefined;

  const heroRef = useFadeIn<HTMLDivElement>({ y: 14 });
  const gridRef = useStaggerReveal<HTMLDivElement>({ y: 20, stagger: 0.12, delay: 0.2 });

  function handleMarkResolved() {
    if (!disbursement) return;
    updateDisbursement(disbursement.id, {
      status: "completed",
      completedAt: new Date(),
      failedAt: null,
      failureReason: null,
    });
    toast.success("Disbursement marked as resolved");
  }

  if (!disbursement) {
    return (
      <AppShell title="Disbursement">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="max-w-md rounded-2xl bg-white p-8 shadow-card">
            <p className="text-lg font-medium text-foreground">
              Disbursement not found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              The disbursement you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
            <Link to="/dashboard">
              <Button variant="outline" className="mt-6 rounded-xl">
                <ArrowLeft className="size-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Disbursement">
      <div ref={heroRef} className="mb-8 space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 shrink-0" aria-hidden />
          Back
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-lg font-semibold text-foreground sm:text-xl">
              {disbursement.recipientName}
            </p>
            <p className="font-mono text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
              {formatPHP(disbursement.amount)}
            </p>
          </div>
          <StatusBadge status={disbursement.status} size="md" />
        </div>
      </div>

      {disbursement.status === "failed" && (
        <div className="mb-8 rounded-2xl border border-destructive/30 bg-[var(--color-danger-light)] p-5 sm:p-6">
          <p className="text-sm font-semibold text-[color-mix(in srgb, var(--color-danger) 90%, black)]">
            Couldn&apos;t complete
          </p>
          {disbursement.failureReason && (
            <p className="mt-2 text-sm leading-relaxed text-[color-mix(in srgb, var(--color-danger) 70%, black)]">
              {disbursement.failureReason}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/disbursements/new">
              <Button variant="outline" size="sm" className="rounded-xl">
                Edit &amp; Retry
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary"
              onClick={handleMarkResolved}
            >
              Mark as Resolved
            </Button>
          </div>
        </div>
      )}

      <div ref={gridRef} className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
        <div className="rounded-2xl bg-white/70 border border-border/60 backdrop-blur-sm p-6 shadow-card sm:p-8 lg:col-span-2">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Timeline
          </h2>
          <StatusTimeline disbursement={disbursement} />
        </div>

        <div className="rounded-2xl bg-white/70 border border-border/60 backdrop-blur-sm p-6 shadow-card sm:p-8 lg:col-span-1">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Details
          </h2>
          <dl className="space-y-5">
            <DetailRow label="Bank" value={getBankName(disbursement.bankCode)} />
            <DetailRow
              label="Account"
              value={maskAccount(disbursement.accountNumber)}
            />
            <DetailRow label="Reference" value={disbursement.reference} />
            <DetailRow label="Batch ID" value={disbursement.batchId} />
            <DetailRow label="Submitted by" value={disbursement.submittedBy} />
            <DetailRow label="Purpose" value={disbursement.purpose} />
          </dl>
        </div>
      </div>
    </AppShell>
  );
}

function DetailRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
