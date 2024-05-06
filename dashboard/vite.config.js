import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from "node:url";

const filesNeedToExclude = ["../viz.config.json", "../../viz.config.json"];

const filesPathToExclude = filesNeedToExclude.map((src) => {
  return fileURLToPath(new URL(src, import.meta.url));
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    minify: true,
    cssMinify: true,
    sourcemap: false,
    manifest: true,
    rollupOptions: {
      external: [
        ...filesPathToExclude
      ],
    },
  },
});
