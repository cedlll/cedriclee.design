
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  AlertCircle,
  Info,
  CheckCircle2,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { useAppStore } from "@disb/lib/store";
import { formatPHP } from "@disb/lib/constants";
import { formatDistanceToNow } from "date-fns";

const notificationIcons: Record<string, typeof Info> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
};

const notificationColors: Record<string, string> = {
  success: "text-primary",
  info: "text-info",
  warning: "text-warning",
  error: "text-[color-mix(in srgb, var(--color-danger) 90%, black)]",
};

interface HeaderProps {
  title: string;
}

export function Header({ title }: Readonly<HeaderProps>) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const settingsActive = pathname === "/settings" || pathname.startsWith("/settings/");

  const notifications = useAppStore((s) => s.notifications);
  const balance = useAppStore((s) => s.balance);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useAppStore(
    (s) => s.markAllNotificationsRead,
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header className="header-scroll-backdrop sticky top-0 z-10 flex min-h-14 items-center justify-between gap-4 border-b border-border px-4 py-3 sm:min-h-16 sm:px-6 lg:px-8">
      <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {title}
      </h1>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          to="/settings"
          className={`flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-secondary hover:text-foreground ${
            settingsActive ? "bg-secondary text-foreground" : "text-muted-foreground"
          }`}
          aria-label="Settings"
          title="Settings"
        >
          <Settings className="size-[20px]" aria-hidden />
        </Link>

        <div
          className="hidden items-center rounded-full border border-border bg-card px-3.5 py-1.5 shadow-card sm:flex"
          title="Available for disbursement"
        >
          <span className="font-mono text-xs font-semibold tabular-nums text-foreground md:text-[13px]">
            {formatPHP(balance.available)}
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="relative flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
          >
            <Bell className="size-[20px]" />
            {unreadCount > 0 && (
              <span
                className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background"
                aria-hidden
              />
            )}
          </button>

          {open && (
            <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-border bg-popover shadow-modal sm:w-96">
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm font-semibold text-foreground">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllNotificationsRead()}
                    className="flex items-center gap-1 text-xs font-medium text-primary underline-offset-2 hover:underline"
                  >
                    <CheckCheck className="size-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto px-1.5 pb-1.5">
                {notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = notificationIcons[n.type] ?? Info;
                    const color =
                      notificationColors[n.type] ?? "text-muted-foreground";

                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          if (!n.read) markNotificationRead(n.id);
                        }}
                        className={`w-full rounded-xl px-3.5 py-3 text-left transition-colors hover:bg-secondary/70 ${
                          n.read ? "" : "bg-secondary/60"
                        }`}
                      >
                        <div className="flex gap-3">
                          <Icon
                            className={`mt-0.5 size-4 shrink-0 ${color}`}
                            aria-hidden
                          />
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm leading-snug ${
                                n.read
                                  ? "text-muted-foreground"
                                  : "font-medium text-foreground"
                              }`}
                            >
                              {n.message}
                            </p>
                            <p
                              className="mt-1 text-xs text-muted-foreground"
                              suppressHydrationWarning
                            >
                              {formatDistanceToNow(n.timestamp, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                          {!n.read && (
                            <span
                              className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                              aria-hidden
                            />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
