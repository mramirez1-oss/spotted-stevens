/**
 * Public label for feeds. Never surfaces auth email — only the profile handle.
 * Bad/legacy values (empty, looks like email) show as Anonymous.
 */
export function displayUsername(raw: string | null | undefined): string {
  if (raw == null) {
    return "Anonymous";
  }
  const t = raw.trim();
  if (t === "" || t.includes("@")) {
    return "Anonymous";
  }
  return t;
}

/** Signed-in header: real handle only, or null if profile missing / value looks like email. */
export function profileHandle(raw: string | null | undefined): string | null {
  if (raw == null) {
    return null;
  }
  const t = raw.trim();
  if (t === "" || t.includes("@")) {
    return null;
  }
  return t;
}
