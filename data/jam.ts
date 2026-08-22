export const JAM_SONGS = [
  "Small, But Mighty!",
  "The Storm",
  "Monster In The Woods",
  "The Night My Brother Died",
  "Not Done Bleeding",
  "There's No Dragons Here",
] as const;

export type JamSong = (typeof JAM_SONGS)[number];

export const JAM_MAX_FILE_MB = 50;
export const JAM_MAX_FILE_BYTES = JAM_MAX_FILE_MB * 1024 * 1024;

const ALLOWED_EXTENSIONS = ["mp4", "mov", "webm", "m4v"] as const;

export const JAM_FILE_ACCEPT = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-m4v",
  ".mp4",
  ".mov",
  ".webm",
  ".m4v",
].join(",");

export const JAM_FILE_HINT = `Video only — MP4, MOV, or WebM. Keep it under ${JAM_MAX_FILE_MB}MB.`;
export const JAM_FILE_ERROR = "Please upload a video — MP4, MOV, or WebM.";

export function getFileExtension(name: string): string {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? (parts.pop() ?? "") : "";
}

export function isAllowedJamFile(file: { name: string }): boolean {
  return ALLOWED_EXTENSIONS.includes(
    getFileExtension(file.name) as (typeof ALLOWED_EXTENSIONS)[number],
  );
}

export function jamBlobPathname(originalName: string): string {
  const ext = getFileExtension(originalName);
  const stem =
    originalName
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "clip";

  return `lets-jam/${stem}.${ext || "bin"}`;
}

export function isJamBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname.endsWith(".blob.vercel-storage.com") ||
        url.hostname === "blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
