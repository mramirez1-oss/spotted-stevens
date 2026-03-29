declare module "heic-convert" {
  function convert(opts: {
    buffer: Uint8Array;
    format: "JPEG" | "PNG";
    quality?: number;
  }): Promise<Uint8Array | ArrayBuffer>;

  export default convert;
}
