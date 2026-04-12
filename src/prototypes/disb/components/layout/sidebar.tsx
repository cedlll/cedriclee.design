import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Send,
  Users,
  Calendar,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@disb/lib/utils";
import { isNavActive } from "@disb/lib/nav";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/disbursements/new", label: "Disbursements", icon: Send },
  { href: "/recipients", label: "Recipients", icon: Users },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

/** Placeholder mark — replace with exported brand asset when ready. */
function BrandMark({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        width="32"
        height="32"
        rx="9"
        fill="var(--sidebar)"
        stroke="var(--sidebar-border)"
        strokeWidth="1"
      />
      <path
        d="M10 11.5 24 16 10 20.5 13.5 16 10 11.5Z"
        fill="var(--sidebar-primary)"
      />
    </svg>
  );
}

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="bg-sidebar-surface hidden w-20 shrink-0 overflow-x-hidden px-2 py-5 lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 z-20 border-r border-sidebar">
      <div className="mb-6 flex justify-center px-0">
        <Link
          to="/dashboard"
          className="flex items-center justify-center rounded-lg outline-none ring-primary transition-colors focus-visible:ring-2"
          title="DisbursePH — Dashboard"
        >
          <BrandMark className="size-8 shrink-0" />
          <span className="sr-only">DisbursePH</span>
        </Link>
      </div>

      <nav className="flex flex-col gap-0.5" aria-label="Main">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isNavActive(pathname, href);

          return (
            <Link
              key={href}
              to={href}
              title={label}
              className={cn(
                "flex items-center justify-center rounded-lg px-0 py-2.5 text-[13px] font-medium transition-colors duration-150 ease-out",
                active
                  ? "bg-sidebar-nav-active text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-[18px] shrink-0",
                  active ? "text-primary" : "text-muted-foreground",
                )}
                strokeWidth={active ? 2.25 : 1.75}
                aria-hidden
              />
              <span className="sr-only">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-sidebar pt-4 px-0">
        <div className="flex flex-col items-center gap-2 rounded-lg px-0 py-1 transition-colors hover:bg-sidebar-accent">
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white"
            title="Merchant — admin@merchant.ph"
            aria-hidden
          >
            M
          </div>
          <div className="sr-only">
            <p className="truncate text-xs font-semibold text-foreground">
              Merchant
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              admin@merchant.ph
            </p>
          </div>
          <button
            type="button"
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </aside>
  );
}
