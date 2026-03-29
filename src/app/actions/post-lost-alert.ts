"use server";

import { revalidatePath } from "next/cache";
import { isStevensEmail } from "@/lib/auth/validators";
import {
  createServiceClient,
  getSessionUser,
} from "@/lib/supabase/server";

export type PostLostAlertState = {
  ok: boolean;
  message?: string;
};

export async function postLostAlert(
  _prev: PostLostAlertState | null,
  formData: FormData,
): Promise<PostLostAlertState> {
  const description = String(formData.get("description") ?? "").trim();
  const locationLastSeen = String(
    formData.get("location_last_seen") ?? "",
  ).trim();

  if (!description || description.length > 2000) {
    return {
      ok: false,
      message: "Please enter a description (max 2000 characters).",
    };
  }

  if (!locationLastSeen || locationLastSeen.length > 500) {
    return {
      ok: false,
      message: "Please say where you last saw it (max 500 characters).",
    };
  }

  const user = await getSessionUser();
  if (!user?.id) {
    return {
      ok: false,
      message: "Log in to post a lost alert.",
    };
  }
  if (!isStevensEmail(user.email ?? "")) {
    return {
      ok: false,
      message: "Only @stevens.edu accounts can post.",
    };
  }

  let supabase;
  try {
    supabase = createServiceClient();
  } catch {
    return {
      ok: false,
      message:
        "Server is not configured for Supabase. Check environment variables.",
    };
  }

  const { data, error } = await supabase
    .from("lost_alerts")
    .insert({
      description,
      location_last_seen: locationLastSeen,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error) {
    const hint =
      error.code === "42501" || error.message?.toLowerCase().includes("policy")
        ? " Check RLS policies or use the service role key in SUPABASE_SERVICE_ROLE_KEY."
        : "";
    return {
      ok: false,
      message: (error.message || "Could not post your alert.") + hint,
    };
  }

  if (!data?.id) {
    return {
      ok: false,
      message: "Insert did not return a row. Check the lost_alerts table and policies.",
    };
  }

  revalidatePath("/lost-alerts");
  return { ok: true, message: "Your alert was posted." };
}
