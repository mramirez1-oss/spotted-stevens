import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { isAuthConfigured } from "@/lib/supabase/server";

export const metadata = {
  title: "Log in — Spotted",
};

export default function LoginPage() {
  if (!isAuthConfigured()) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <p className="text-spot-blue">
          Add{" "}
          <code className="rounded bg-spot-sky/40 px-1 text-sm text-spot-navy">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          to{" "}
          <code className="rounded bg-spot-sky/40 px-1 text-sm text-spot-navy">
            .env.local
          </code>
          .
        </p>
        <Link
          href="/"
          className="mt-4 inline-block font-medium text-spot-navy hover:underline"
        >
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-spot-navy">Log in</h1>
      <p className="mt-2 text-sm text-spot-blue">
        Enter your campus username and password. We look up your account in the
        background — no email field on this page.
      </p>
      <div className="mt-8 rounded-2xl border border-spot-sky/50 bg-white p-6 shadow-lg shadow-spot-navy/5">
        <LoginForm />
      </div>
    </div>
  );
}
