import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Calls your Supabase RPC `get_email_from_username`.
 * Postgres parameter must match: `username_input` → JSON key below.
 */
export async function resolveEmailFromUsername(
  supabase: SupabaseClient,
  rawUsername: string,
): Promise<{ email: string | null; error: string | null }> {
  const username = rawUsername.trim();
  if (!username) {
    return { email: null, error: "Enter your username." };
  }

  const { data, error } = await supabase.rpc("get_email_from_username", {
    username_input: username,
  });

  if (error) {
    return { email: null, error: error.message };
  }

  if (data == null || data === "") {
    return { email: null, error: "We couldn’t find an account with that username." };
  }

  const email = typeof data === "string" ? data : String(data);
  return { email, error: null };
}
