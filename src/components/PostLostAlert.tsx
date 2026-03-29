"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  postLostAlert,
  type PostLostAlertState,
} from "@/app/actions/post-lost-alert";

const initialState: PostLostAlertState | null = null;

const inputClass =
  "w-full rounded-xl border border-spot-sky/60 bg-white px-3 py-2 text-sm text-spot-navy placeholder:text-spot-blue/45 focus:border-spot-blue focus:outline-none focus:ring-2 focus:ring-spot-blue/20";

function PostLostAlertForm({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(
    postLostAlert,
    initialState,
  );
  const firstFieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!state?.ok) return;
    const t = window.setTimeout(() => onClose(), 900);
    return () => window.clearTimeout(t);
  }, [state?.ok, onClose]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="lost-description"
          className="mb-1 block text-sm font-medium text-spot-navy"
        >
          What did you lose?
        </label>
        <textarea
          ref={firstFieldRef}
          id="lost-description"
          name="description"
          required
          rows={4}
          maxLength={2000}
          disabled={pending}
          placeholder="Describe the item — color, size, name on it, etc."
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="lost-location"
          className="mb-1 block text-sm font-medium text-spot-navy"
        >
          Where did you last see it?
        </label>
        <input
          id="lost-location"
          name="location_last_seen"
          type="text"
          required
          maxLength={500}
          disabled={pending}
          placeholder="e.g. Cafeteria, bus 12, locker hall"
          className={inputClass}
        />
      </div>

      {state?.message && (
        <p
          role={state.ok ? "status" : "alert"}
          className={
            state.ok ? "text-sm font-medium text-spot-blue" : "text-sm text-red-600"
          }
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="rounded-xl px-4 py-2 text-sm font-medium text-spot-blue hover:bg-spot-sky/40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-xl bg-spot-coral px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-spot-coral-hover disabled:opacity-60"
        >
          {pending ? "Posting…" : "Post alert"}
        </button>
      </div>
    </form>
  );
}

export function PostLostAlert() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setFormKey((k) => k + 1);
          setOpen(true);
        }}
        className="inline-flex items-center justify-center rounded-xl bg-spot-coral px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-spot-coral/25 transition hover:bg-spot-coral-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-spot-blue focus-visible:ring-offset-2"
      >
        Post alert
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center px-4 pb-8 pt-[calc(env(safe-area-inset-top,0px)+min(11vh,3.75rem))] sm:px-6 sm:pb-10 sm:pt-[calc(env(safe-area-inset-top,0px)+min(8vh,2.75rem))]"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-spot-navy/45 backdrop-blur-[2px]"
            aria-label="Close dialog"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-lost-title"
            className="relative z-10 max-h-[min(90dvh,40rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-spot-sky/50 bg-white p-6 shadow-2xl shadow-spot-navy/15"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2
                id="post-lost-title"
                className="text-lg font-semibold text-spot-navy"
              >
                Post a lost alert
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-spot-blue hover:bg-spot-sky/40 hover:text-spot-navy"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <PostLostAlertForm key={formKey} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
