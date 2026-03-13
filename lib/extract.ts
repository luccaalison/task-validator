import JSZip from "jszip";
import type { FileMap } from "./types";

export async function extractZip(file: File): Promise<FileMap> {
  const zip = await JSZip.loadAsync(file);
  const fileMap: FileMap = {};
  const paths = Object.keys(zip.files);

  const prefix = detectRootPrefix(paths);

  const promises = paths.map(async (path) => {
    const entry = zip.files[path];
    if (entry.dir) return;
    if (path.includes("__MACOSX")) return;

    const normalized = prefix ? path.slice(prefix.length) : path;
    if (!normalized) return;

    try {
      fileMap[normalized] = await entry.async("string");
    } catch {
      fileMap[normalized] = "[binary]";
    }
  });

  await Promise.all(promises);
  return fileMap;
}

function detectRootPrefix(paths: string[]): string {
  const nonMac = paths.filter((p) => !p.includes("__MACOSX") && !p.endsWith("/"));
  if (nonMac.length === 0) return "";

  const firstSlash = nonMac[0].indexOf("/");
  if (firstSlash === -1) return "";

  const candidate = nonMac[0].slice(0, firstSlash + 1);

  const allMatch = nonMac.every((p) => p.startsWith(candidate));
  return allMatch ? candidate : "";
}
