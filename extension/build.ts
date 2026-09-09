import { build } from "vite";
import { backgroundConfig, contentConfig, popupConfig } from "./vite.config.js";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

await build({ ...popupConfig, configFile: false });
await build({ ...backgroundConfig, configFile: false });
await build({ ...contentConfig, configFile: false });

const manifestPath = path.resolve(import.meta.dirname, "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as {
  host_permissions: string[];
  [key: string]: unknown;
};
const apiOrigin = new URL(
  process.env.VITE_TRAXJOB_URL ?? "https://www.traxjob.my.id",
).origin;
manifest.host_permissions = [
  ...new Set([...manifest.host_permissions, `${apiOrigin}/*`]),
];
await writeFile(
  path.resolve(import.meta.dirname, "dist/manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
await copyFile(
  path.resolve(import.meta.dirname, "../public/favicon.png"),
  path.resolve(import.meta.dirname, "dist/icon128.png"),
);
