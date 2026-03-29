import type { FoundItem } from "@/types/found-item";

type FoundItemCardProps = {
  item: FoundItem;
};

/** Public Supabase URLs: native img */
export function FoundItemCard({ item }: FoundItemCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-spot-sky/50 bg-white shadow-md shadow-spot-navy/5 transition hover:border-spot-blue/30 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-spot-sky/25">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.description}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-spot-blue/50"
            aria-hidden
          >
            <svg
              className="h-12 w-12 opacity-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-medium uppercase tracking-wide">
              Photo
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-lg font-semibold leading-snug text-spot-navy">
            {item.description}
          </h2>
          <span className="shrink-0 rounded-full bg-spot-sky/40 px-2.5 py-0.5 text-xs font-medium text-spot-navy ring-1 ring-spot-blue/20">
            {item.category}
          </span>
        </div>
        <p className="mt-auto text-sm text-spot-blue">
          <span className="font-medium text-spot-navy">Location found: </span>
          {item.building}
        </p>
        <p className="text-xs text-spot-blue/80">
          Posted by{" "}
          <span className="font-medium text-spot-navy">{item.postedByUsername}</span>
        </p>
      </div>
    </article>
  );
}
