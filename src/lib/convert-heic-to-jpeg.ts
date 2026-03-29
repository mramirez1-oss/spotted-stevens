import convert from "heic-convert";

/**
 * Decode iPhone HEIC/HEIF and re-encode as JPEG so images work in all browsers.
 * Uses `heic-convert` (libheif) on the server only.
 */
export async function convertHeicBufferToJpeg(buffer: Buffer): Promise<Uint8Array> {
  const u8 = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const jpeg = await convert({
    buffer: u8,
    format: "JPEG",
    quality: 0.88,
  });
  return new Uint8Array(jpeg);
}
