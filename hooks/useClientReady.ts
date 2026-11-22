"use client";

import { useSyncExternalStore } from "react";

/** True only after client hydration — safe for localStorage-backed UI. */
export function useClientReady() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
