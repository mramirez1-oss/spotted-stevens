import { NextResponse } from "next/server";
import { mockFoundItems } from "@/data/mock-found-items";
import { getFoundItems } from "@/lib/found-items";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      items: mockFoundItems,
      usingMock: true,
      error: null as string | null,
    });
  }
  try {
    const items = await getFoundItems();
    return NextResponse.json({
      items,
      usingMock: false,
      error: null as string | null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load items.";
    return NextResponse.json(
      { items: [], usingMock: false, error: message },
      { status: 500 },
    );
  }
}
