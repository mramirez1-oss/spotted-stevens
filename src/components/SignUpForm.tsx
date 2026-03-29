"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import {
  isStevensEmail,
  validateSimplePassword,
  validateUsername,
} from "@/lib/auth/validators";

const field =
  "w-full rounded-xl border border-spot-sky/60 bg-white px-3 py-2.5 text-sm text-spot-navy placeholder:text-spot-blue/45 focus:border-spot-blue focus:outline-none focus:ring-2 focus:ring-spot-blue/20";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    const passwordRaw = String(new FormData(form).get("password") ?? "");
    const usernameRaw = String(new FormData(form).get("username") ?? "");

    if (!isStevensEmail(email)) {
      setError("You must use your @stevens.edu email.");
      return;
    }
    const pw = validateSimplePassword(passwordRaw);
    if (!pw.ok) {
      setError(pw.message);
      return;
    }
    const u = validateUsername(usernameRaw);
    if (!u.ok) {
      setError(u.message);
      return;
    }

    setPending(true);
    const supabase = createBrowserSupabaseClient();

    const { data: taken } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", u.username)
      .maybeSingle();

    if (taken) {
      setError("That username is already taken. Pick another.");
      setPending(false);
      return;
    }

    // user_metadata → auth.users.raw_user_meta_data.username for handle_new_user
    const { data: signData, error: signErr } = await supabase.auth.signUp({
      email,
      password: pw.password,
      options: {
        data: {
          username: u.username,
        },
      },
    });

    setPending(false);
    if (signErr) {
      setError(signErr.message);
      return;
    }

    if (signData.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setError(
      "Account created but no session returned. Try logging in with your username.",
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="su-email"
          className="mb-1 block text-sm font-medium text-spot-navy"
        >
          Stevens email
        </label>
        <input
          id="su-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@stevens.edu"
          disabled={pending}
          className={field}
        />
      </div>
      <div>
        <label
          htmlFor="su-user"
          className="mb-1 block text-sm font-medium text-spot-navy"
        >
          Username
        </label>
        <input
          id="su-user"
          name="username"
          type="text"
          required
          autoComplete="username"
          minLength={2}
          maxLength={32}
          pattern="[a-zA-Z0-9_]{2,32}"
          title="Letters, numbers, underscores only"
          placeholder="campus_handle"
          disabled={pending}
          className={field}
        />
        <p className="mt-1 text-xs text-spot-blue/80">
          Letters, numbers, and underscores. Shown on posts instead of your
          email.
        </p>
      </div>
      <div>
        <label
          htmlFor="su-pass"
          className="mb-1 block text-sm font-medium text-spot-navy"
        >
          Password
        </label>
        <input
          id="su-pass"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          disabled={pending}
          className={field}
        />
        <p className="mt-1 text-xs text-spot-blue/80">
          At least 8 characters, letters and numbers only.
        </p>
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
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-spot-blue">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-spot-navy underline-offset-2 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
