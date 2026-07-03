// SPA-only build for Hetzner shared hosting.
// - `nitro: false` disables the Cloudflare/SSR server output.
// - `tanstackStart.spa.enabled` makes TanStack Start prerender a static
//   index.html shell (`dist/index.html`) that boots the router on the client.
// - No `server.entry` override needed — there is no server runtime.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index",
      },
    },
  },
});
