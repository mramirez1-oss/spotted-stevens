import { NextResponse } from "next/server";
import { mockLostAlerts } from "@/data/mock-lost-alerts";
import { getLostAlerts } from "@/lib/lost-alerts";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      alerts: mockLostAlerts,
      usingMock: true,
      error: null as string | null,
    });
  }
  try {
    const result = await getLostAlerts();
    return NextResponse.json({
      alerts: result.alerts,
      usingMock: false,
      error: result.error,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load alerts.";
    return NextResponse.json(
      {
        alerts: [],
        usingMock: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
