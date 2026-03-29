import type { FoundItem } from "@/types/found-item";
import { fetchUsernameByUserIdMap } from "@/lib/profiles-lookup";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

type FoundItemRow = {
  id: string;
  description: string;
  building: string;
  image_url: string | null;
  user_id: string | null;
};

export async function getFoundItems(): Promise<FoundItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("found_items")
    .select("id, description, building, image_url, user_id")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getFoundItems:", error.message);
    return [];
  }

  const rows = (data ?? []) as FoundItemRow[];
  const usernameMap = await fetchUsernameByUserIdMap(
    supabase,
    rows.map((r) => r.user_id),
  );

  return rows.map((row) => ({
    id: row.id,
    description: row.description,
    category: "General",
    building: row.building,
    imageUrl: row.image_url ?? undefined,
    postedByUsername:
      row.user_id && usernameMap.has(row.user_id)
        ? usernameMap.get(row.user_id)!
        : "Anonymous",
  }));
}
