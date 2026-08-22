import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NovexaHub",
    short_name: "NovexaHub",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#05060f",
    theme_color: "#00c2ff",
    icons: [{ src: "/brand/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
