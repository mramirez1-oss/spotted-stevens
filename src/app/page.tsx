import { FoundItemCard } from "@/components/FoundItemCard";
import { mockFoundItems } from "@/data/mock-found-items";
import { getFoundItems } from "@/lib/found-items";
import { isSupabaseConfigured } from "@/lib/supabase/server";

/** Always fetch current items when Supabase env is present */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const fromDb = isSupabaseConfigured() ? await getFoundItems() : null;
  const items = fromDb ?? mockFoundItems;
  const usingMock = fromDb === null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-spot-sky/40 bg-gradient-to-br from-white via-spot-cream to-spot-sky/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-spot-coral">
              Spotted
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-spot-navy sm:text-4xl">
              Found items
            </h1>
            <p className="max-w-2xl text-spot-blue">
              Recently turned-in items. Check with the main office to claim
              something that belongs to you.
            </p>
          </div>
          {usingMock && (
            <p className="rounded-xl border border-spot-sky/60 bg-white/80 px-3 py-2 text-sm text-spot-navy shadow-sm">
              Add{" "}
              <code className="rounded bg-spot-sky/40 px-1 font-mono text-xs">
                NEXT_PUBLIC_SUPABASE_URL
              </code>
              ,{" "}
              <code className="rounded bg-spot-sky/40 px-1 font-mono text-xs">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>
              , and{" "}
              <code className="rounded bg-spot-sky/40 px-1 font-mono text-xs">
                SUPABASE_SERVICE_ROLE_KEY
              </code>{" "}
              in{" "}
              <code className="rounded bg-spot-sky/40 px-1 font-mono text-xs">
                .env.local
              </code>
              . Run migrations{" "}
              <code className="rounded bg-spot-sky/40 px-1 font-mono text-xs">
                001
              </code>
              ,{" "}
              <code className="rounded bg-spot-sky/40 px-1 font-mono text-xs">
                002
              </code>
              ,{" "}
              <code className="rounded bg-spot-sky/40 px-1 font-mono text-xs">
                003_auth_profiles.sql
              </code>{" "}
              in the Supabase SQL editor.
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold text-spot-navy">Found items</h2>
          <span className="text-sm text-spot-blue/80">
            {items.length} listed
          </span>
        </div>

        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-spot-sky/60 bg-white/60 px-6 py-12 text-center text-spot-blue">
            No items yet. Be the first to report something you found.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.id}>
                <FoundItemCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
