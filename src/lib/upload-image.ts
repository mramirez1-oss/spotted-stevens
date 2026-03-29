/** Normalize phone uploads: common image types from camera or gallery */

export type ResolvedUpload =
  | { ok: true; ext: string; contentType: string }
  | { ok: false; message: string };

const MAX_BYTES = 12 * 1024 * 1024;

const EXT_FOR_STORAGE: Record<string, string> = {
  jpg: "jpg",
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  heic: "heic",
  heif: "heif",
};

const MIME_TO_CANON: Record<string, { ext: string; contentType: string }> = {
  "image/jpeg": { ext: "jpg", contentType: "image/jpeg" },
  "image/jpg": { ext: "jpg", contentType: "image/jpeg" },
  "image/pjpeg": { ext: "jpg", contentType: "image/jpeg" },
  "image/png": { ext: "png", contentType: "image/png" },
  "image/webp": { ext: "webp", contentType: "image/webp" },
  "image/heic": { ext: "heic", contentType: "image/heic" },
  "image/heif": { ext: "heif", contentType: "image/heif" },
  "image/heic-sequence": { ext: "heic", contentType: "image/heic" },
  "image/heif-sequence": { ext: "heif", contentType: "image/heif" },
};

const MIME_ALIASES: Record<string, string> = {
  "public.jpeg": "image/jpeg",
  "public.jpg": "image/jpeg",
  "public.heic": "image/heic",
  "public.heif": "image/heif",
};

function extensionFromFilename(name: string): string | null {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : null;
}

function normalizeMime(raw: string): string {
  const base = raw.trim().toLowerCase().split(";")[0].trim();
  return MIME_ALIASES[base] ?? base;
}

function readFourCC(u: Uint8Array, offset: number): string {
  if (offset + 4 > u.length) return "";
  return String.fromCharCode(
    u[offset],
    u[offset + 1],
    u[offset + 2],
    u[offset + 3],
  );
}

/** When name/MIME are missing (common on mobile), sniff common formats */
function sniffImage(u: Uint8Array): { ext: string; contentType: string } | null {
  if (u.length < 12) return null;

  if (u[0] === 0xff && u[1] === 0xd8 && u[2] === 0xff) {
    return { ext: "jpg", contentType: "image/jpeg" };
  }

  if (
    u[0] === 0x89 &&
    u[1] === 0x50 &&
    u[2] === 0x4e &&
    u[3] === 0x47 &&
    u[4] === 0x0d &&
    u[5] === 0x0a &&
    u[6] === 0x1a &&
    u[7] === 0x0a
  ) {
    return { ext: "png", contentType: "image/png" };
  }

  if (
    u[0] === 0x52 &&
    u[1] === 0x49 &&
    u[2] === 0x46 &&
    u[3] === 0x46 &&
    u.length >= 12 &&
    u[8] === 0x57 &&
    u[9] === 0x45 &&
    u[10] === 0x42 &&
    u[11] === 0x50
  ) {
    return { ext: "webp", contentType: "image/webp" };
  }

  const heicBrands = new Set([
    "heic",
    "heix",
    "mif1",
    "msf1",
    "hevc",
    "hevx",
    "heim",
    "heis",
  ]);

  const scan = Math.min(u.length - 8, 4096);
  for (let i = 0; i <= scan; i++) {
    if (
      u[i] === 0x66 &&
      u[i + 1] === 0x74 &&
      u[i + 2] === 0x79 &&
      u[i + 3] === 0x70
    ) {
      const brand = readFourCC(u, i + 4);
      if (heicBrands.has(brand)) {
        return { ext: "heic", contentType: "image/heic" };
      }
      if (brand === "heif") {
        return { ext: "heif", contentType: "image/heif" };
      }
    }
  }

  return null;
}

export async function resolvePhotoForUpload(
  file: File,
): Promise<ResolvedUpload> {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Please upload a photo." };
  }

  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      message: "Photo must be 12 MB or smaller.",
    };
  }

  const name = file.name || "";
  const extFromName = extensionFromFilename(name);
  const extKey = extFromName?.toLowerCase() ?? "";
  const normalizedExtKey =
    extKey === "jpeg" ? "jpg" : extKey === "heif" ? "heif" : extKey;

  let mime = normalizeMime(file.type || "");
  if (mime === "application/octet-stream" || mime === "") {
    mime = "";
  }

  let ext: string | undefined;
  let contentType: string | undefined;

  if (mime && MIME_TO_CANON[mime]) {
    ext = MIME_TO_CANON[mime].ext;
    contentType = MIME_TO_CANON[mime].contentType;
  } else if (normalizedExtKey && EXT_FOR_STORAGE[normalizedExtKey]) {
    ext = EXT_FOR_STORAGE[normalizedExtKey];
    contentType =
      mime && MIME_TO_CANON[mime]
        ? MIME_TO_CANON[mime].contentType
        : ext === "jpg"
          ? "image/jpeg"
          : ext === "png"
            ? "image/png"
            : ext === "webp"
              ? "image/webp"
              : ext === "heic"
                ? "image/heic"
                : ext === "heif"
                  ? "image/heif"
                  : "application/octet-stream";
  }

  if (!ext || !contentType) {
    const head = file.slice(0, 4096);
    const buf = await head.arrayBuffer();
    const sniffed = sniffImage(new Uint8Array(buf));
    if (sniffed) {
      ext = sniffed.ext;
      contentType = sniffed.contentType;
    }
  }

  if (!ext || !contentType) {
    return {
      ok: false,
      message:
        "Please choose a photo (JPEG, PNG, WebP, or HEIC from your phone).",
    };
  }

  return { ok: true, ext, contentType };
}
