// ============= Full file contents =============
// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Local development parity: on Lovable the backend credentials are injected into
// process.env automatically, but when running `npm run dev` on a laptop Vite only
// exposes VITE_* variables to the client. Server functions read process.env
// (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY), so without this they crash with
// "Missing Supabase environment variable(s)" and nothing gets saved (e.g. new ads).
function loadDotEnvIntoProcessEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const rawLine of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
  // Mirror VITE_* values onto their bare names used by server code.
  for (const name of ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_PROJECT_ID"]) {
    if (!process.env[name] && process.env[`VITE_${name}`]) {
      process.env[name] = process.env[`VITE_${name}`];
    }
  }
}

loadDotEnvIntoProcessEnv();

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
