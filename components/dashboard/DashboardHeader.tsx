"use client";

import { NotificationBell } from "@/components/engagement/NotificationBell";
import Image from "next/image";
import type { ReactNode } from "react";

export function DashboardHeader({
  title,
  subtitle,
  user,
  actions,
  showNotifications = false,
}: {
  title: string;
  subtitle?: string;
  user: { name: string; avatar: string; role: string };
  actions?: ReactNode;
  showNotifications?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border bg-white px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {title}
        </h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        {showNotifications ? <NotificationBell /> : null}
        <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full">
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
