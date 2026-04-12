
import { useState, useEffect } from "react";
import { formatUtcLongDate } from "@disb/lib/date-display";
import { Lock, Calendar, Check } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@disb/components/layout/app-shell";
import { Button } from "@disb/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@disb/components/ui/radio-group";
import { Label } from "@disb/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@disb/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@disb/components/ui/dialog";
import { useAppStore } from "@disb/lib/store";
import { useStaggerReveal } from "@disb/lib/use-gsap";
import { MOCK_NOW } from "@disb/lib/mock-data";
import type { PayoutFrequency, MerchantTier } from "@disb/lib/constants";

const SCHEDULE_OPTIONS: {
  value: PayoutFrequency;
  label: string;
  description: string;
}[] = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Payouts are processed on the 1st of each month",
  },
  {
    value: "biweekly",
    label: "Bi-weekly",
    description: "Payouts are processed every two weeks",
  },
  {
    value: "on_demand",
    label: "On-Demand",
    description: "Request payouts at any time",
  },
];

function getUnlockedFrequencies(tier: MerchantTier): Set<PayoutFrequency> {
  switch (tier) {
    case "standard":
      return new Set<PayoutFrequency>(["monthly"]);
    case "verified":
      return new Set<PayoutFrequency>(["monthly", "biweekly"]);
    case "premium":
      return new Set<PayoutFrequency>(["monthly", "biweekly", "on_demand"]);
  }
}

function getLockReason(freq: PayoutFrequency, tier: MerchantTier): string {
  if (tier === "standard" && freq !== "monthly") {
    return "Complete KYC verification and maintain at least 3 months of transaction history to unlock this payout frequency.";
  }
  if (tier === "verified" && freq === "on_demand") {
    return "Upgrade to Premium tier to unlock on-demand payouts. Premium merchants get instant access to all payout frequencies.";
  }
  return "";
}

function computeNextPayoutDate(freq: PayoutFrequency): Date {
  const now = MOCK_NOW;
  if (freq === "on_demand") return new Date(now);
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const day = now.getUTCDate();
  if (freq === "biweekly") {
    const next = new Date(Date.UTC(y, m, day));
    next.setUTCDate(day + (14 - (day % 14)));
    return next;
  }
  return new Date(Date.UTC(y, m + 1, 1));
}

export default function SchedulePage() {
  const {
    payoutFrequency,
    nextPayoutDate,
    merchantTier,
    setPayoutFrequency,
    setMerchantTier,
  } = useAppStore();

  const [selected, setSelected] = useState<PayoutFrequency>(payoutFrequency);
  const [expandedLock, setExpandedLock] = useState<PayoutFrequency | null>(
    null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const unlocked = getUnlockedFrequencies(merchantTier);
  const hasChanges = selected !== payoutFrequency;
  const sectionsRef = useStaggerReveal<HTMLDivElement>({ y: 18, stagger: 0.12 });

  useEffect(() => {
    if (!unlocked.has(selected)) {
      setSelected(unlocked.has(payoutFrequency) ? payoutFrequency : "monthly");
    }
    setExpandedLock(null);
  }, [merchantTier]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleOptionClick(freq: PayoutFrequency) {
    if (!unlocked.has(freq)) {
      setExpandedLock((prev) => (prev === freq ? null : freq));
      return;
    }
    setSelected(freq);
    setExpandedLock(null);
  }

  function handleConfirm() {
    setPayoutFrequency(selected);
    setConfirmOpen(false);
    toast.success(
      `Payout schedule updated to ${SCHEDULE_OPTIONS.find((o) => o.value === selected)?.label}`
    );
  }

  const selectedLabel =
    SCHEDULE_OPTIONS.find((o) => o.value === selected)?.label ?? selected;
  const nextDateForSelected = computeNextPayoutDate(selected);

  return (
    <AppShell title="Schedule">
      <div ref={sectionsRef} className="flex flex-col gap-8 lg:gap-10">
      <div className="rounded-2xl bg-white/70 border border-border/60 backdrop-blur-sm p-5 shadow-card sm:p-7">
        <h2 className="text-sm font-semibold text-foreground">
          Current schedule
        </h2>
        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:gap-12">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Frequency
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Calendar className="size-4 shrink-0 text-info" aria-hidden />
              <span className="text-sm font-medium text-foreground">
                {SCHEDULE_OPTIONS.find((o) => o.value === payoutFrequency)
                  ?.label ?? payoutFrequency}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Next payout
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {payoutFrequency === "on_demand"
                ? "Available now"
                : formatUtcLongDate(nextPayoutDate)}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-5 text-sm font-semibold text-foreground">
          Change frequency
        </h2>
        <RadioGroup
          value={selected}
          onValueChange={(val: PayoutFrequency) => {
            if (unlocked.has(val)) {
              setSelected(val);
              setExpandedLock(null);
            }
          }}
          className="grid gap-4"
        >
          {SCHEDULE_OPTIONS.map((opt) => {
            const isLocked = !unlocked.has(opt.value);
            const isSelected = selected === opt.value;

            let optionStyle = "border-border bg-white hover:border-primary/30 hover:shadow-card";
            if (isLocked) optionStyle = "border-border bg-white opacity-35";
            else if (isSelected) optionStyle = "border-primary bg-primary/[0.03] shadow-card";

            return (
              <div key={opt.value}>
                <button
                  type="button"
                  onClick={() => handleOptionClick(opt.value)}
                  className={`flex w-full cursor-pointer items-start gap-4 rounded-2xl border p-5 text-left transition-all sm:p-6 ${optionStyle}`}
                >
                  <div className="pt-0.5">
                    {isLocked ? (
                      <div className="flex h-4 w-4 items-center justify-center">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    ) : (
                      <RadioGroupItem value={opt.value} aria-label={opt.label} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-foreground">
                        {opt.label}
                      </Label>
                      {isLocked && (
                        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          Locked
                        </span>
                      )}
                      {isSelected && !isLocked && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {opt.description}
                    </p>
                  </div>
                </button>

                {isLocked && expandedLock === opt.value && (
                  <div className="mt-3 ml-8 rounded-xl border border-warning/40 bg-[var(--color-warning-light)] px-4 py-3.5 sm:ml-10">
                    <p className="text-sm leading-relaxed text-warning">
                      {getLockReason(opt.value, merchantTier)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </RadioGroup>

        <div className="mt-8">
          <Button
            disabled={!hasChanges}
            onClick={() => setConfirmOpen(true)}
            className="h-11 rounded-xl bg-primary px-6 text-white hover:bg-primary/90 disabled:opacity-40 transition-colors"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-white rounded-2xl shadow-modal">
          <DialogHeader>
            <DialogTitle className="text-foreground font-semibold">
              Confirm Schedule Change
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-muted-foreground">
            {`Changing to `}
            <span className="font-medium text-foreground">{selectedLabel}</span>
            {` payouts means your next payout will be `}
            <span className="font-medium text-foreground">
              {selected === "on_demand"
                ? "available immediately"
                : formatUtcLongDate(nextDateForSelected)}
            </span>
            {`. Confirm?`}
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="bg-secondary text-foreground rounded-xl hover:bg-border transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-2xl border border-dashed border-border/80 bg-white p-5 shadow-card sm:p-7">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Demo tier
        </p>
        <Select
          value={merchantTier}
          onValueChange={(val) => { if (val) setMerchantTier(val as MerchantTier); }}
        >
          <SelectTrigger
            aria-label="Demo tier"
            className="w-48 bg-white border border-border rounded-xl text-foreground"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-border">
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
        <p className="mt-2 text-sm text-muted-foreground">
          Try different tiers to see locked options.
        </p>
      </div>
      </div>
    </AppShell>
  );
}
