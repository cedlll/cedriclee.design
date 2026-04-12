
import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Upload,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";

import { AppShell } from "@disb/components/layout/app-shell";
import { ProcessingEstimate } from "@disb/components/disbursements/processing-estimate";
import { Button } from "@disb/components/ui/button";
import { Input } from "@disb/components/ui/input";
import { Label } from "@disb/components/ui/label";
import { Textarea } from "@disb/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@disb/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@disb/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@disb/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@disb/components/ui/dialog";
import { useAppStore } from "@disb/lib/store";
import { formatPHP } from "@disb/lib/constants";
import { csvTemplate, MOCK_NOW } from "@disb/lib/mock-data";
import { useFadeIn } from "@disb/lib/use-gsap";
import type { Disbursement } from "@disb/lib/mock-data";
import type { BankCode } from "@disb/lib/constants";

const VALID_BANK_CODES = new Set([
  "BDO", "BPI", "MBT", "UBP", "RCBC", "SBC", "PNB", "LBP", "DBP", "GCASH", "MAYA",
]);

const schema = z.object({
  recipientId: z.string().min(1, "Select a recipient"),
  amount: z.string().min(1, "Amount is required").refine(v => {
    const n = Number.parseFloat(v.replaceAll(",", ""));
    return !Number.isNaN(n) && n > 0 && n <= 999999;
  }, "Amount must be between ₱1 and ₱999,999"),
  purpose: z.string().min(1, "Purpose is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ParsedRow {
  rowNumber: number;
  recipientName: string;
  bankCode: string;
  accountNumber: string;
  amount: number;
  purpose: string;
}

interface CsvValidation {
  valid: ParsedRow[];
  invalid: { rowNumber: number; reason: string }[];
  totalAmount: number;
  totalRows: number;
}

function validateRow(
  cols: string[],
): { error?: string; row?: Omit<ParsedRow, "rowNumber"> } {
  if (cols.length < 5) return { error: "Insufficient columns" };

  const [recipientName, bankCode, accountNumber, amountStr, ...purposeParts] = cols;
  const purpose = purposeParts.join(",").trim();

  if (!recipientName) return { error: "Recipient name is required" };
  if (recipientName.length > 100) return { error: "Recipient name exceeds 100 characters" };
  if (!VALID_BANK_CODES.has(bankCode)) return { error: `Invalid bank code "${bankCode}"` };
  if (!/^\d{10,16}$/.test(accountNumber)) return { error: "Account number must be 10–16 digits" };

  const amount = Number.parseFloat(amountStr);
  if (Number.isNaN(amount) || amount <= 0 || amount > 999999) {
    return { error: "Amount must be between 1 and 999,999" };
  }
  if (!purpose) return { error: "Purpose is required" };

  return { row: { recipientName, bankCode, accountNumber, amount, purpose } };
}

function validateCsv(text: string): CsvValidation {
  const lines = text.trim().split("\n");
  if (lines.length < 2) {
    return { valid: [], invalid: [], totalAmount: 0, totalRows: 0 };
  }

  const dataLines = lines.slice(1).filter((l) => l.trim() !== "");
  const valid: ParsedRow[] = [];
  const invalid: { rowNumber: number; reason: string }[] = [];

  for (let idx = 0; idx < dataLines.length; idx++) {
    const rowNumber = idx + 2;
    const cols = dataLines[idx].split(",").map((c) => c.trim());
    const result = validateRow(cols);

    if (result.error) {
      invalid.push({ rowNumber, reason: result.error });
    } else if (result.row) {
      valid.push({ rowNumber, ...result.row });
    }
  }

  return {
    valid,
    invalid,
    totalAmount: valid.reduce((sum, r) => sum + r.amount, 0),
    totalRows: dataLines.length,
  };
}

function genId(): string {
  return "DSB-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function genRef(): string {
  return "REF-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default function NewDisbursementPage() {
  const navigate = useNavigate();
  const { recipients, addDisbursement, addDisbursements } = useAppStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      recipientId: "",
      amount: "",
      purpose: "",
      date: "",
      notes: "",
    },
  });

  const [csvResult, setCsvResult] = useState<CsvValidation | null>(null);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const today = MOCK_NOW.toISOString().split("T")[0];
  const formRef = useFadeIn<HTMLDivElement>({ y: 16 });

  // --- Single Transfer ---

  const amountField = register("amount");

  const handleAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    amountField.onBlur(e);
    const raw = e.target.value.replaceAll(",", "");
    const n = Number.parseFloat(raw);
    if (!Number.isNaN(n) && n > 0) {
      setValue("amount", n.toLocaleString("en-US"));
    }
  };

  const onSingleSubmit = (data: FormValues) => {
    const recipient = recipients.find((r) => r.id === data.recipientId);
    if (!recipient) return;

    const amount = Number.parseFloat(data.amount.replaceAll(",", ""));
    const now = new Date();

    const disbursement: Disbursement = {
      id: genId(),
      recipientId: recipient.id,
      recipientName: recipient.name,
      bankCode: recipient.bankCode,
      accountNumber: recipient.accountNumber,
      amount,
      status: "queued",
      reference: genRef(),
      purpose: data.purpose,
      notes: data.notes ?? "",
      batchId: `BATCH-${String(Date.now()).slice(-3)}`,
      submittedBy: "admin@merchant.ph",
      submittedAt: now,
      processingAt: null,
      inTransitAt: null,
      completedAt: null,
      failedAt: null,
      failureReason: null,
      estimatedCompletion: new Date(now.getTime() + 48 * 60 * 60 * 1000),
    };

    addDisbursement(disbursement);
    toast.success("Disbursement scheduled successfully");
    navigate("/dashboard");
  };

  // --- Bulk Upload ---

  const handleDownloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "disbursement-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setCsvFileName(file.name);
    file.text().then((text) => {
      setCsvResult(validateCsv(text));
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  const handleBulkSubmit = () => {
    if (!csvResult) return;

    const now = new Date();
    const batchId = `BATCH-${String(Date.now()).slice(-3)}`;

    const newDisbursements: Disbursement[] = csvResult.valid.map((row) => ({
      id: genId(),
      recipientId: "",
      recipientName: row.recipientName,
      bankCode: row.bankCode as BankCode,
      accountNumber: row.accountNumber,
      amount: row.amount,
      status: "queued" as const,
      reference: genRef(),
      purpose: row.purpose,
      notes: "",
      batchId,
      submittedBy: "admin@merchant.ph",
      submittedAt: now,
      processingAt: null,
      inTransitAt: null,
      completedAt: null,
      failedAt: null,
      failureReason: null,
      estimatedCompletion: new Date(now.getTime() + 48 * 60 * 60 * 1000),
    }));

    addDisbursements(newDisbursements);
    setShowConfirmDialog(false);
    toast.success(`${newDisbursements.length} disbursements scheduled successfully`);
    navigate("/dashboard");
  };

  return (
    <AppShell title="New disbursement">
      <div ref={formRef} className="mx-auto max-w-3xl space-y-8">
        <Tabs defaultValue="single">
          <TabsList className="mb-8 w-full justify-start gap-1 rounded-xl bg-secondary p-1 sm:w-auto">
            <TabsTrigger value="single" className="rounded-[10px] px-5 py-2 text-sm font-medium">
              Single
            </TabsTrigger>
            <TabsTrigger value="bulk" className="rounded-[10px] px-5 py-2 text-sm font-medium">
              Bulk
            </TabsTrigger>
          </TabsList>

          {/* ===== Single Transfer ===== */}
          <TabsContent value="single">
            <form onSubmit={handleSubmit(onSingleSubmit)} className="space-y-6 sm:space-y-8">
              <div className="space-y-6 rounded-2xl bg-white/70 border border-border/60 backdrop-blur-sm p-5 shadow-card sm:p-7">
                {/* Recipient */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Recipient
                  </Label>
                  <Controller
                    name="recipientId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          const v = val as string;
                          if (v === "__add_new") {
                            navigate("/recipients");
                            return;
                          }
                          field.onChange(v);
                        }}
                      >
                        <SelectTrigger
                          aria-label="Recipient"
                          className="h-11 w-full bg-white border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                        >
                          <SelectValue placeholder="Select a recipient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__add_new">
                            + Add new recipient
                          </SelectItem>
                          {recipients.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name} — {r.bankCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.recipientId && (
                    <p className="text-sm text-destructive">{errors.recipientId.message}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Amount
                  </Label>
                  <Input
                    type="text"
                    placeholder="0.00"
                    aria-label="Amount"
                    className="h-11 bg-white border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                    {...amountField}
                    onBlur={handleAmountBlur}
                  />
                  {errors.amount && (
                    <p className="text-sm text-destructive">{errors.amount.message}</p>
                  )}
                </div>

                {/* Purpose */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Purpose
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. Salary disbursement"
                    aria-label="Purpose"
                    className="h-11 bg-white border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                    {...register("purpose")}
                  />
                  {errors.purpose && (
                    <p className="text-sm text-destructive">{errors.purpose.message}</p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-foreground">
                      Date
                    </Label>
                    <Tooltip>
                      <TooltipTrigger
                        render={<span />}
                        className="inline-flex cursor-help text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Info className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Disbursements are processed in batches. Selecting today means next available batch.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    type="date"
                    min={today}
                    aria-label="Date"
                    className="h-11 bg-white border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                    {...register("date")}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date.message}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Notes{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    placeholder="Any additional notes..."
                    aria-label="Notes (optional)"
                    className="bg-white border border-border rounded-xl text-foreground placeholder:text-muted-foreground min-h-[80px] focus:border-primary focus:ring-2 focus:ring-primary/10"
                    {...register("notes")}
                  />
                </div>
              </div>

              {/* Processing Estimate */}
              <div className="rounded-2xl bg-white/70 border border-border/60 backdrop-blur-sm p-5 shadow-card sm:p-7">
                <h3 className="mb-5 text-sm font-semibold text-foreground">
                  Expected timeline
                </h3>
                <ProcessingEstimate status="queued" submittedAt={MOCK_NOW} />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-primary px-5 font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Schedule disbursement
              </Button>
            </form>
          </TabsContent>

          {/* ===== Bulk Upload ===== */}
          <TabsContent value="bulk">
            <div className="space-y-8">
              <div className="rounded-2xl bg-white p-5 shadow-card sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">CSV template</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      Download, fill in, then upload below.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadTemplate}
                    className="shrink-0 rounded-xl border-border bg-secondary text-foreground hover:bg-border transition-colors"
                  >
                    <Download className="mr-2 size-4" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Drag & Drop Zone */}
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-all sm:px-10 sm:py-16 ${
                  isDragActive
                    ? "border-primary bg-secondary/70/20"
                    : "border-border/80 bg-white hover:border-muted-foreground"
                }`}
              >
                <input {...getInputProps()} aria-label="Upload CSV file" />
                <Upload className="mx-auto mb-4 size-9 text-muted-foreground" aria-hidden />
                {isDragActive ? (
                  <p className="text-primary font-medium">Drop your CSV file here...</p>
                ) : (
                  <>
                    <p className="font-medium text-foreground">
                      Drop a CSV here or tap to browse
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">.csv only</p>
                  </>
                )}
                {csvFileName && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2 text-sm text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {csvFileName}
                  </div>
                )}
              </div>

              {/* Validation Panel */}
              {csvResult && (
                <div className="space-y-5 rounded-2xl bg-white p-5 shadow-card sm:p-7">
                  <h3 className="text-sm font-semibold text-foreground">Check results</h3>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <div className="rounded-xl bg-secondary/70 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Rows</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">{csvResult.totalRows}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/70 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Valid</p>
                      <p className="mt-1 text-lg font-semibold text-primary">{csvResult.valid.length}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/70 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Invalid</p>
                      <p className="mt-1 text-lg font-semibold text-destructive">{csvResult.invalid.length}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/70 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {formatPHP(csvResult.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {csvResult.valid.length > 0 && (
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {csvResult.valid.length} valid row(s)
                      </span>
                    </div>
                  )}

                  {csvResult.invalid.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-destructive">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {csvResult.invalid.length} invalid row(s)
                        </span>
                      </div>
                      <div className="max-h-48 overflow-y-auto rounded-lg bg-secondary/40 p-3 space-y-1">
                        {csvResult.invalid.map((err) => (
                          <div key={err.rowNumber} className="flex items-start gap-2 text-xs">
                            <span className="font-mono text-muted-foreground shrink-0">
                              Row {err.rowNumber}:
                            </span>
                            <span className="text-destructive">{err.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={csvResult.invalid.length > 0 || csvResult.valid.length === 0}
                    className="h-12 w-full bg-primary hover:bg-primary/90 text-white rounded-xl px-5 font-medium disabled:opacity-40 transition-colors"
                  >
                    Schedule {csvResult.valid.length} Disbursement(s)
                  </Button>
                </div>
              )}
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <DialogContent className="bg-white border-border text-foreground">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    Confirm Bulk Disbursement
                  </DialogTitle>
                </DialogHeader>
                {csvResult && (
                  <div className="space-y-3 py-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total disbursements</span>
                      <span className="font-medium">{csvResult.valid.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total amount</span>
                      <span className="font-medium text-primary">
                        {formatPHP(csvResult.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">Queued for next batch</span>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowConfirmDialog(false)}
                    className="border-border text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleBulkSubmit}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-2.5 font-medium transition-colors"
                  >
                    Confirm & Schedule
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
