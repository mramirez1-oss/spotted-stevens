import type { LostAlert } from "@/types/lost-alert";
import { fetchUsernameByUserIdMap } from "@/lib/profiles-lookup";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

type LostAlertRow = {
  id: string;
  description: string;
  location_last_seen: string;
  created_at: string;
  user_id: string | null;
};

export type LostAlertsResult = {
  alerts: LostAlert[];
  error: string | null;
};

export async function getLostAlerts(): Promise<LostAlertsResult> {
  if (!isSupabaseConfigured()) {
    return { alerts: [], error: null };
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("lost_alerts")
      .select("id, description, location_last_seen, created_at, user_id")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getLostAlerts:", error.code, error.message, error.details);
      return {
        alerts: [],
        error: error.message || "Could not load lost alerts.",
      };
    }

    const rows = (data ?? []) as LostAlertRow[];
    const usernameMap = await fetchUsernameByUserIdMap(
      supabase,
      rows.map((r) => r.user_id),
    );

    const alerts: LostAlert[] = rows.map((row) => ({
      id: row.id,
      description: row.description,
      locationLastSeen: row.location_last_seen,
      createdAt: row.created_at,
      postedByUsername:
        row.user_id && usernameMap.has(row.user_id)
          ? usernameMap.get(row.user_id)!
          : "Anonymous",
    }));

    return { alerts, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not load lost alerts.";
    console.error("getLostAlerts:", e);
    return { alerts: [], error: msg };
  }
}
