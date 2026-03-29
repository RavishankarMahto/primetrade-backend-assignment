import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "dist", "swagger");
mkdirSync(outDir, { recursive: true });
copyFileSync(join(root, "src", "swagger", "openapi.json"), join(outDir, "openapi.json"));
