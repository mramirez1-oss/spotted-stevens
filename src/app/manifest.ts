import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Spotted — school lost & found",
    short_name: "Spotted",
    description:
      "Share found items and lost alerts for your campus in one place.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffcf2",
    theme_color: "#1d3557",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
