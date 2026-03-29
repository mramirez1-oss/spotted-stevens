const USERNAME_RE = /^[a-zA-Z0-9_]{2,32}$/;
/** Letters and numbers only (simple passwords) */
const PASSWORD_SIMPLE_RE = /^[a-zA-Z0-9]+$/;

export function isStevensEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  return (
    e.endsWith("@stevens.edu") &&
    e.includes("@") &&
    e.length > "@stevens.edu".length
  );
}

export function validateUsername(
  raw: string,
): { ok: true; username: string } | { ok: false; message: string } {
  const username = raw.trim();
  if (!USERNAME_RE.test(username)) {
    return {
      ok: false,
      message:
        "Username must be 2–32 characters: letters, numbers, and underscores only.",
    };
  }
  return { ok: true, username };
}

export function validateSimplePassword(
  raw: string,
): { ok: true; password: string } | { ok: false; message: string } {
  const password = raw;
  if (password.length < 8) {
    return {
      ok: false,
      message: "Password must be at least 8 characters.",
    };
  }
  if (!PASSWORD_SIMPLE_RE.test(password)) {
    return {
      ok: false,
      message: "Password must use only letters and numbers.",
    };
  }
  return { ok: true, password };
}
