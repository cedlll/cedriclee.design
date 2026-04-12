
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  ChevronRight,
  Mail,
  Shield,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@disb/components/layout/app-shell";
import { Button } from "@disb/components/ui/button";
import { Label } from "@disb/components/ui/label";
import { Switch } from "@disb/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@disb/components/ui/card";
import { Separator } from "@disb/components/ui/separator";
import { useAppStore } from "@disb/lib/store";
import { formatPHP, type MerchantTier } from "@disb/lib/constants";
import { useStaggerReveal } from "@disb/lib/use-gsap";

const tierLabel: Record<MerchantTier, string> = {
  standard: "Standard",
  verified: "Verified",
  premium: "Premium",
};

function SwitchRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: Readonly<{
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
}>) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <Label
          htmlFor={id}
          className="cursor-pointer text-sm font-medium text-foreground"
        >
          {label}
        </Label>
        {description ? (
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(next) => onCheckedChange(next)}
      />
    </div>
  );
}

export default function SettingsPage() {
  const balance = useAppStore((s) => s.balance);
  const merchantTier = useAppStore((s) => s.merchantTier);

  const [payoutAlerts, setPayoutAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const sectionsRef = useStaggerReveal<HTMLDivElement>({
    y: 18,
    stagger: 0.1,
  });

  function persistNotificationPrefs() {
    toast.success("Notification preferences saved");
  }

  return (
    <AppShell title="Settings">
      <div ref={sectionsRef} className="flex flex-col gap-5 sm:gap-6">
        <Card className="rounded-2xl border-border shadow-none ring-0">
          <CardHeader className="border-b border-secondary pb-4">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Building2 className="size-5 text-primary" aria-hidden />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-foreground">Account</CardTitle>
                <CardDescription>
                  Merchant profile and verification tier
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Business
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                Merchant
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[var(--color-success-light)] px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                {tierLabel[merchantTier]}
              </span>
              <span className="text-xs text-muted-foreground">
                Available balance{" "}
                <span className="font-mono font-semibold tabular-nums text-foreground">
                  {formatPHP(balance.available)}
                </span>
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>admin@merchant.ph</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-none ring-0">
          <CardHeader className="border-b border-secondary pb-4">
            <CardTitle className="text-foreground">Notifications</CardTitle>
            <CardDescription>
              Choose how we reach you about payouts and activity
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <SwitchRow
              id="settings-payout-alerts"
              label="Payout status alerts"
              description="Email when a disbursement completes or fails"
              checked={payoutAlerts}
              onCheckedChange={setPayoutAlerts}
            />
            <Separator className="bg-secondary" />
            <SwitchRow
              id="settings-weekly-digest"
              label="Weekly summary"
              description="A recap of volume and recipients"
              checked={weeklyDigest}
              onCheckedChange={setWeeklyDigest}
            />
            <div className="mt-5 flex justify-end border-t border-secondary pt-4">
              <Button
                type="button"
                size="lg"
                onClick={persistNotificationPrefs}
                className="min-w-[11rem] rounded-xl px-5 shadow-sm hover:shadow-md"
              >
                Save preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-none ring-0">
          <CardHeader className="border-b border-secondary pb-4">
            <CardTitle className="text-foreground">Payouts</CardTitle>
            <CardDescription>
              Cadence and next run date live on the schedule screen
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Link
              to="/schedule"
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3.5 text-left transition-colors hover:border-sidebar-border hover:bg-white"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-border">
                  <CalendarClock
                    className="size-[18px] text-primary"
                    aria-hidden
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">
                    Payout schedule
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Change frequency and view next payout
                  </span>
                </span>
              </span>
              <ChevronRight
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-none ring-0">
          <CardHeader className="border-b border-secondary pb-4">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Shield className="size-5 text-primary" aria-hidden />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-foreground">Security</CardTitle>
                <CardDescription>
                  Sign-in and session controls (coming soon)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              Password changes and two-factor authentication will appear here in
              a future release.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
