import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

function readPublicEnv(): { url: string; anon: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anon) {
    return null;
  }
  return { url, anon };
}

/** True when browser bundle has both public Supabase env vars. */
export function isBrowserSupabaseConfigured(): boolean {
  return readPublicEnv() !== null;
}

/**
 * Returns null if NEXT_PUBLIC_SUPABASE_URL or anon key is missing — callers must
 * show a Configuration Error instead of calling Supabase.
 */
export function createBrowserSupabaseClient(): SupabaseClient | null {
  const env = readPublicEnv();
  if (!env) {
    return null;
  }
  return createBrowserClient(env.url, env.anon);
}
