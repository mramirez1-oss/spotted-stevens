"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resolveEmailFromUsername } from "@/lib/auth/resolve-email-from-username";
import { validateUsername } from "@/lib/auth/validators";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const field =
  "w-full rounded-xl border border-spot-sky/60 bg-white px-3 py-2.5 text-sm text-spot-navy placeholder:text-spot-blue/45 focus:border-spot-blue focus:outline-none focus:ring-2 focus:ring-spot-blue/20";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const usernameRaw = String(new FormData(form).get("username") ?? "");
    const password = String(new FormData(form).get("password") ?? "");

    const u = validateUsername(usernameRaw);
    if (!u.ok) {
      setError(u.message);
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }

    setPending(true);
    const supabase = createBrowserSupabaseClient();

    const { email, error: rpcError } = await resolveEmailFromUsername(
      supabase,
      u.username,
    );
    if (rpcError || !email) {
      setPending(false);
      setError(rpcError ?? "Could not look up your account.");
      return;
    }

    const { error: signErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setPending(false);

    if (signErr) {
      setError(signErr.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="li-user"
          className="mb-1 block text-sm font-medium text-spot-navy"
        >
          Username
        </label>
        <input
          id="li-user"
          name="username"
          type="text"
          required
          autoComplete="username"
          minLength={2}
          maxLength={32}
          pattern="[a-zA-Z0-9_]{2,32}"
          title="Letters, numbers, underscores"
          placeholder="your_username"
          disabled={pending}
          className={field}
        />
      </div>
      <div>
        <label
          htmlFor="li-pass"
          className="mb-1 block text-sm font-medium text-spot-navy"
        >
          Password
        </label>
        <input
          id="li-pass"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={pending}
          className={field}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-spot-coral px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-spot-coral/25 transition hover:bg-spot-coral-hover disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-spot-blue">
        No account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-spot-navy underline-offset-2 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
