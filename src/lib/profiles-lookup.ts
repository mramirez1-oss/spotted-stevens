import type { SupabaseClient } from "@supabase/supabase-js";
import { displayUsername } from "@/lib/display-username";

/** Batch-load usernames by profile id (no FK/embed needed on alerts/items). */
export async function fetchUsernameByUserIdMap(
  supabase: SupabaseClient,
  userIds: (string | null | undefined)[],
): Promise<Map<string, string>> {
  const ids = [
    ...new Set(
      userIds.filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  ];
  if (ids.length === 0) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", ids);

  if (error || !data?.length) {
    if (error) {
      console.error("fetchUsernameByUserIdMap:", error.message);
    }
    return new Map();
  }

  return new Map(
    data.map((row: { id: string; username: string }) => [
      row.id,
      displayUsername(row.username),
    ]),
  );
}
