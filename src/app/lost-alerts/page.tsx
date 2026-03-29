import Link from "next/link";
import { getLostAlerts } from "@/lib/lost-alerts";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { mockLostAlerts } from "@/data/mock-lost-alerts";
import { formatAlertTime } from "@/lib/format-date";
import type { LostAlert } from "@/types/lost-alert";

export const dynamic = "force-dynamic";

export default async function LostAlertsPage() {
  const configured = isSupabaseConfigured();
  const { alerts: dbAlerts, error: fetchError } = configured
    ? await getLostAlerts()
    : { alerts: [] as LostAlert[], error: null };

  const usingMock = !configured;
  const alerts = configured ? dbAlerts : mockLostAlerts;

  return (
    <div className="min-h-screen">
      <div className="border-b border-spot-sky/40 bg-gradient-to-br from-white via-spot-cream to-spot-sky/20">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-spot-coral">
            Spotted
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-spot-navy">
            Lost alerts
          </h1>
          <p className="mt-2 text-spot-blue">
            Classmates post what they’re missing. If you find something, check{" "}
            <Link
              href="/"
              className="font-semibold text-spot-navy underline-offset-2 hover:underline"
            >
              Found items
            </Link>
            .
          </p>
          {configured && (
            <p className="mt-3 text-sm text-spot-blue/80">
              {fetchError
                ? "Could not refresh the feed."
                : `${alerts.length} alert${alerts.length === 1 ? "" : "s"} · newest first from Supabase`}
            </p>
          )}
          {usingMock && (
            <p className="mt-4 rounded-xl border border-spot-sky/60 bg-white/80 px-3 py-2 text-sm text-spot-navy shadow-sm">
              Add{" "}
              <code className="rounded bg-spot-sky/40 px-1 font-mono text-xs">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              and{" "}
              <code className="rounded bg-spot-sky/40 px-1 font-mono text-xs">
                SUPABASE_SERVICE_ROLE_KEY
              </code>{" "}
              in{" "}
              <code className="rounded bg-spot-sky/40 px-1 font-mono text-xs">
                .env.local
              </code>{" "}
              to load and post real alerts.
            </p>
          )}
          {configured && fetchError && (
            <div
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
              role="alert"
            >
              <p className="font-medium">Could not load alerts from Supabase</p>
              <p className="mt-1 font-mono text-xs opacity-90">{fetchError}</p>
              <p className="mt-2 text-red-800">
                Check that the table{" "}
                <code className="rounded bg-red-100 px-1">lost_alerts</code>{" "}
                exists and your service role can select rows (or RLS allows it).
              </p>
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="sr-only">Alert feed</h2>
        {configured && fetchError ? (
          <p className="rounded-2xl border border-dashed border-spot-sky/60 bg-white/60 px-6 py-12 text-center text-spot-blue">
            Fix the connection issue above, then refresh the page.
          </p>
        ) : alerts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-spot-sky/60 bg-white/60 px-6 py-12 text-center text-spot-blue">
            No alerts yet. Use{" "}
            <strong className="font-semibold text-spot-navy">Post alert</strong>{" "}
            in the header to add one{configured ? "" : " once Supabase is set up"}.
          </p>
        ) : (
          <ol className="flex flex-col gap-4">
            {alerts.map((alert) => (
              <li key={alert.id}>
                <article className="rounded-2xl border border-spot-sky/50 bg-white p-5 shadow-md shadow-spot-navy/5">
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-spot-navy">
                    {alert.description}
                  </p>
                  <p className="mt-3 text-sm text-spot-blue">
                    <span className="font-medium text-spot-navy">
                      Last seen:{" "}
                    </span>
                    {alert.locationLastSeen}
                  </p>
                  <p className="mt-2 text-xs text-spot-blue/80">
                    Posted by{" "}
                    <span className="font-medium text-spot-navy">
                      {alert.postedByUsername}
                    </span>
                    <span className="text-spot-blue/50"> · </span>
                    <span className="text-spot-blue/60">
                      {formatAlertTime(alert.createdAt)}
                    </span>
                  </p>
                </article>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}
