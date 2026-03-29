"use server";

import { revalidatePath } from "next/cache";
import { BUILDINGS } from "@/constants/buildings";
import { convertHeicBufferToJpeg } from "@/lib/convert-heic-to-jpeg";
import { isStevensEmail } from "@/lib/auth/validators";
import { resolvePhotoForUpload } from "@/lib/upload-image";
import {
  createServiceClient,
  getSessionUser,
} from "@/lib/supabase/server";

export type ReportFoundItemState = {
  ok: boolean;
  message?: string;
};

export async function reportFoundItem(
  _prev: ReportFoundItemState | null,
  formData: FormData,
): Promise<ReportFoundItemState> {
  const description = String(formData.get("description") ?? "").trim();
  const building = String(formData.get("building") ?? "").trim();
  const photo = formData.get("photo");

  if (!description || description.length > 2000) {
    return {
      ok: false,
      message: "Please enter a description (max 2000 characters).",
    };
  }

  if (!BUILDINGS.includes(building as (typeof BUILDINGS)[number])) {
    return { ok: false, message: "Please choose a valid building." };
  }

  if (!(photo instanceof File)) {
    return { ok: false, message: "Please upload a photo." };
  }

  const resolved = await resolvePhotoForUpload(photo);
  if (!resolved.ok) {
    return { ok: false, message: resolved.message };
  }

  const user = await getSessionUser();
  if (!user?.id) {
    return {
      ok: false,
      message: "Log in to report a found item.",
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

  let buffer = Buffer.from(await photo.arrayBuffer());
  let uploadExt = resolved.ext;
  let uploadContentType = resolved.contentType;

  if (resolved.ext === "heic" || resolved.ext === "heif") {
    try {
      const jpegBytes = await convertHeicBufferToJpeg(buffer);
      buffer = Buffer.from(jpegBytes);
    } catch {
      return {
        ok: false,
        message:
          "Could not convert this HEIC photo to JPEG. Try Settings → Camera → Formats → Most Compatible, or export as JPEG from Photos.",
      };
    }
    uploadExt = "jpg";
    uploadContentType = "image/jpeg";
  }

  const path = `public/${crypto.randomUUID()}.${uploadExt}`;

  const { error: uploadError } = await supabase.storage
    .from("found-images")
    .upload(path, buffer, {
      contentType: uploadContentType,
      upsert: false,
    });

  if (uploadError) {
    return {
      ok: false,
      message:
        uploadError.message ||
        "Could not upload photo. Is the storage bucket set up?",
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("found-images").getPublicUrl(path);

  const { error: insertError } = await supabase.from("found_items").insert({
    description,
    building,
    image_url: publicUrl,
    user_id: user.id,
  });

  if (insertError) {
    await supabase.storage.from("found-images").remove([path]);
    return {
      ok: false,
      message: insertError.message || "Could not save the report.",
    };
  }

  revalidatePath("/");
  return { ok: true, message: "Thanks — your report was saved." };
}
