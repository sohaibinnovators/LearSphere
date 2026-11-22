"use client";

import { useEngagementStore } from "@/hooks/useEngagementStore";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatStudentDateTime } from "@/app/student/utils";

export function NotificationBell() {
  const {
    ready,
    store,
    unreadCount,
    markRead,
    markAllRead,
    removeNotification,
  } = useEngagementStore();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = store.notifications.slice(0, 6);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted hover:bg-surface hover:text-foreground"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="h-4 w-4" />
        {ready && unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-border bg-white shadow-[var(--shadow-md)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <button
              type="button"
              className="text-xs font-medium text-primary hover:text-primary-dark disabled:text-muted"
              disabled={unreadCount === 0}
              onClick={() => markAllRead()}
            >
              Mark all read
            </button>
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">
              No notifications yet. Enroll or complete lessons to create local
              demo alerts.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    !item.read && "bg-primary/5",
                  )}
                >
                  <div className="px-4 py-3">
                    <Link
                      href={item.href}
                      className="block"
                      onClick={() => {
                        markRead(item.id);
                        setOpen(false);
                      }}
                    >
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-muted">{item.message}</p>
                      <p className="mt-2 text-[11px] text-muted">
                        {formatStudentDateTime(item.createdAt)} · local demo
                      </p>
                    </Link>
                    <div className="mt-2 flex gap-3">
                      {!item.read ? (
                        <button
                          type="button"
                          className="text-xs font-medium text-primary"
                          onClick={() => markRead(item.id)}
                        >
                          Mark read
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="text-xs font-medium text-muted hover:text-danger"
                        onClick={() => removeNotification(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border px-4 py-2.5">
            <Link
              href="/student/notifications"
              className="text-xs font-medium text-primary hover:text-primary-dark"
              onClick={() => setOpen(false)}
            >
              Open notification center
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
