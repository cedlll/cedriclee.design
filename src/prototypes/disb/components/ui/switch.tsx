import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@disb/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border border-[color-mix(in srgb, var(--border) 80%, var(--muted-foreground))] bg-[color-mix(in srgb, var(--secondary) 70%, var(--border))] px-0.5 shadow-[inset_0_1px_2px_color-mix(in_srgb,var(--foreground)_6%,transparent)] transition-colors",
        "data-[checked]:border-primary/90 data-[checked]:bg-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "data-[checked]:[&_[data-slot=switch-thumb]]:translate-x-6 data-[checked]:[&_[data-slot=switch-thumb]]:shadow-md",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-7 translate-x-0 rounded-full bg-white shadow-sm ring-1 ring-foreground/10 transition-[transform,box-shadow] duration-200 ease-out will-change-transform",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
