export const PH_BANKS = [
  { code: "BDO", name: "BDO Unibank" },
  { code: "BPI", name: "Bank of the Philippine Islands" },
  { code: "MBT", name: "Metrobank" },
  { code: "UBP", name: "UnionBank of the Philippines" },
  { code: "RCBC", name: "Rizal Commercial Banking Corporation" },
  { code: "SBC", name: "Security Bank" },
  { code: "PNB", name: "Philippine National Bank" },
  { code: "LBP", name: "Landbank of the Philippines" },
  { code: "DBP", name: "Development Bank of the Philippines" },
  { code: "GCASH", name: "GCash" },
  { code: "MAYA", name: "Maya" },
] as const;

export type BankCode = (typeof PH_BANKS)[number]["code"];

export const BANK_CODE_SET = new Set(PH_BANKS.map((b) => b.code));

export function getBankName(code: string): string {
  return PH_BANKS.find((b) => b.code === code)?.name ?? code;
}

export type DisbursementStatus =
  | "queued"
  | "processing"
  | "in_transit"
  | "completed"
  | "failed";

export type VerificationStatus = "verified" | "pending" | "failed";

export type MerchantTier = "standard" | "verified" | "premium";

export type PayoutFrequency = "monthly" | "biweekly" | "on_demand";

export const STATUS_CONFIG: Record<
  DisbursementStatus,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  queued: {
    label: "Queued",
    color: "text-muted-foreground",
    bgColor: "bg-secondary",
    dotColor: "bg-[var(--muted-foreground)]",
  },
  processing: {
    label: "Processing",
    color: "text-info",
    bgColor: "bg-[var(--color-info-light)]",
    dotColor: "bg-info",
  },
  in_transit: {
    label: "In Transit",
    color: "text-warning",
    bgColor: "bg-[var(--color-warning-light)]",
    dotColor: "bg-warning",
  },
  completed: {
    label: "Completed",
    color: "text-primary",
    bgColor: "bg-[var(--color-success-light)]",
    dotColor: "bg-[var(--color-success)]",
  },
  failed: {
    label: "Failed",
    color: "text-destructive",
    bgColor: "bg-[var(--color-danger-light)]",
    dotColor: "bg-destructive",
  },
};

export const VERIFICATION_CONFIG: Record<
  VerificationStatus,
  { label: string; color: string; bgColor: string }
> = {
  verified: {
    label: "Verified",
    color: "text-primary",
    bgColor: "bg-[var(--color-success-light)]",
  },
  pending: {
    label: "Pending",
    color: "text-warning",
    bgColor: "bg-[var(--color-warning-light)]",
  },
  failed: {
    label: "Failed",
    color: "text-destructive",
    bgColor: "bg-[var(--color-danger-light)]",
  },
};

export function formatPHP(amount: number): string {
  return `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function maskAccount(account: string): string {
  if (account.length <= 4) return account;
  return "****" + account.slice(-4);
}
