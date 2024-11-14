// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    envPrefix: "NEXT_PUBLIC_",
    ssr: {
      noExternal: ["webcoreui"],
    },
  },
});
