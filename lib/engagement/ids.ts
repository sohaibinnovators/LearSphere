export function createId(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

export function createCredentialId(courseId: string): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const short = courseId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
  return `LS-${short || "COURSE"}-${stamp}`;
}
