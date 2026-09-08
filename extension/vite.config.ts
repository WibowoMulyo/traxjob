import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = import.meta.dirname;

export const popupConfig = defineConfig({
  root,
  plugins: [react()],
  build: {
    outDir: path.resolve(root, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(root, "index.html"),
    },
  },
});

export const backgroundConfig = defineConfig({
  root,
  build: {
    outDir: path.resolve(root, "dist"),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(root, "src/background.ts"),
      formats: ["es"],
      fileName: () => "background.js",
    },
  },
});

export const contentConfig = defineConfig({
  root,
  build: {
    outDir: path.resolve(root, "dist"),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(root, "src/content.ts"),
      name: "TraxJobContent",
      formats: ["iife"],
      fileName: () => "content.js",
    },
  },
});
