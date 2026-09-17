import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NovexaHub",
    short_name: "NovexaHub",
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#f3efe8",
    theme_color: "#f3efe8",
    icons: [{ src: "/brand/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
