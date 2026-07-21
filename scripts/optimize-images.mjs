import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const runtimeModules =
  "/Users/wufengqing/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const require = createRequire(`${runtimeModules}/index.js`);
const sharp = require("sharp");

const root = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(root, "public/assets/images");
const archiveDir = path.join(root, "source-assets/images-original");

await fs.mkdir(archiveDir, { recursive: true });

for (const name of await fs.readdir(sourceDir)) {
  if (!name.endsWith(".png")) continue;

  const input = path.join(sourceDir, name);
  const output = path.join(sourceDir, name.replace(/\.png$/i, ".webp"));
  const archive = path.join(archiveDir, name);

  await sharp(input)
    .resize({
      width: 2400,
      height: 16000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 92, effort: 5, smartSubsample: true })
    .toFile(output);

  await fs.copyFile(input, archive);
  await fs.rm(input);
}
