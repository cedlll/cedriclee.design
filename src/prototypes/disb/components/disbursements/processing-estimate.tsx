
import { cn } from "@disb/lib/utils";
import { MOCK_NOW } from "@disb/lib/mock-data";
import type { DisbursementStatus } from "@disb/lib/constants";

function formatTimeUtc(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(d);
}

interface ProcessingEstimateProps {
  status: DisbursementStatus;
  submittedAt: Date;
}

interface EstimateStep {
  label: string;
  range: string;
  estimatedTime: Date;
  state: "completed" | "current" | "future";
}

function buildEstimateSteps(
  status: DisbursementStatus,
  submittedAt: Date
): EstimateStep[] {
  const now = MOCK_NOW;
  const statusIndex =
    status === "failed"
      ? 1
      : ["queued", "processing", "in_transit", "completed"].indexOf(status);

  const steps: { label: string; range: string; hoursOffset: number }[] = [
    { label: "Submitted", range: "", hoursOffset: 0 },
    { label: "Processing", range: "0–2 hrs", hoursOffset: 2 },
    { label: "In Transit", range: "2–24 hrs", hoursOffset: 24 },
    { label: "Completed", range: "", hoursOffset: 48 },
  ];

  return steps.map((step, i) => {
    const estimatedTime = new Date(
      submittedAt.getTime() + step.hoursOffset * 60 * 60 * 1000
    );

    let state: "completed" | "current" | "future";
    if (i < statusIndex) {
      state = "completed";
    } else if (i === statusIndex) {
      state = "current";
    } else {
      state = estimatedTime <= now ? "completed" : "future";
    }

    return { label: step.label, range: step.range, estimatedTime, state };
  });
}

const stateColors = {
  completed: {
    dot: "bg-[var(--color-success)]",
    line: "bg-[var(--color-success)]",
    text: "text-foreground",
    time: "text-muted-foreground",
  },
  current: {
    dot: "bg-[var(--chart-2)] ring-4 ring-[var(--chart-2)]/20",
    line: "border-t-2 border-dashed border-border/80",
    text: "text-[var(--chart-2)]",
    time: "text-[var(--chart-2)]",
  },
  future: {
    dot: "border-2 border-border/80 bg-white",
    line: "border-t-2 border-dashed border-border/80",
    text: "text-muted-foreground",
    time: "text-muted-foreground",
  },
};

export function ProcessingEstimate({
  status,
  submittedAt,
}: Readonly<ProcessingEstimateProps>) {
  const steps = buildEstimateSteps(status, submittedAt);

  return (
    <div className="-mx-1 min-w-0 overflow-x-auto px-1 pb-1">
      <div className="flex min-w-[min(100%,32rem)] items-start sm:min-w-0">
      {steps.map((step, i) => {
        const colors = stateColors[step.state];
        const isLast = i === steps.length - 1;

        return (
          <div
            key={step.label}
            className={cn("flex flex-col items-center", !isLast && "flex-1")}
          >
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "h-3 w-3 shrink-0 rounded-full",
                  colors.dot
                )}
              />
              {!isLast && (
                <div className={cn("h-0 flex-1", colors.line)} />
              )}
            </div>

            <div className="mt-2 flex flex-col items-start self-start">
              <span className={cn("text-[13px] font-medium", colors.text)}>
                {step.label}
              </span>
              {step.range && (
                <span className="text-[11px] text-muted-foreground">
                  {step.range}
                </span>
              )}
              <span className={cn("mt-0.5 text-[11px]", colors.time)}>
                {formatTimeUtc(step.estimatedTime)}
              </span>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
