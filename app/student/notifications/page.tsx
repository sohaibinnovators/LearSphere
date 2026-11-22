"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { currentStudent } from "@/lib/data/student";
import { Bell } from "lucide-react";
import Link from "next/link";
import { formatStudentDateTime } from "../utils";

export default function StudentNotificationsPage() {
  const {
    ready,
    store,
    unreadCount,
    markRead,
    markAllRead,
    removeNotification,
  } = useEngagementStore();

  return (
    <>
      <DashboardHeader
        title="Notifications"
        subtitle="Local demo alerts from enrollments, completions, certificates, and replies."
        user={{
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          role: currentStudent.role,
        }}
        showNotifications
        actions={
          <Button
            size="sm"
            variant="outline"
            type="button"
            disabled={unreadCount === 0}
            onClick={() => markAllRead()}
          >
            Mark all as read
          </Button>
        }
      />

      <div className="p-4 md:p-6">
        {!ready ? (
          <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />
        ) : store.notifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center">
            <Bell className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-medium text-foreground">
              No notifications yet
            </p>
            <p className="mt-1 text-sm text-muted">
              Enroll in a course or complete lessons to generate local demo
              notifications.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {store.notifications.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-border bg-white p-4 shadow-[var(--shadow-sm)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={item.href}
                        className="font-medium text-foreground hover:text-primary"
                        onClick={() => markRead(item.id)}
                      >
                        {item.title}
                      </Link>
                      {!item.read ? <Badge tone="primary">Unread</Badge> : null}
                      <Badge tone="muted">{item.type.replaceAll("_", " ")}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">{item.message}</p>
                    <p className="mt-2 text-xs text-muted">
                      {formatStudentDateTime(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!item.read ? (
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => markRead(item.id)}
                      >
                        Mark read
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() => removeNotification(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
