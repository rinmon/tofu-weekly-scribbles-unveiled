import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
import { execSync } from "child_process";
const commit = (() => {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "unknown";
  }
})();
const buildTime = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
const version = process.env.npm_package_version || "0.0.0";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commit),
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTime),
  },
}));
