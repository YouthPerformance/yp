import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [tailwind(), react()],
  site: "https://neoball.co",
  output: "hybrid", // Allows dynamic routes like /w/[code] while keeping most pages static
});
