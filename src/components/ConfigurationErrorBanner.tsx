export function ConfigurationErrorBanner() {
  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      role="alert"
    >
      <p className="font-semibold">Configuration Error</p>
      <p className="mt-1 text-amber-900/90">
        Missing{" "}
        <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">
          NEXT_PUBLIC_SUPABASE_URL
        </code>{" "}
        or{" "}
        <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>
        . Add them in the hosting dashboard and redeploy.
      </p>
    </div>
  );
}
