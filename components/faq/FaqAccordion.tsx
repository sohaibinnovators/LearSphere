"use client";

import type { FaqItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-border bg-white shadow-[var(--shadow-sm)]"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface/60"
              aria-expanded={open}
            >
              <span className="font-medium text-foreground">{item.question}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted transition",
                  open && "rotate-180",
                )}
              />
            </button>
            {open ? (
              <div className="border-t border-border px-5 py-4">
                <p className="text-sm leading-relaxed text-muted">{item.answer}</p>
                <p className="mt-2 text-xs text-muted">Category: {item.category}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}