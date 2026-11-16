import { AwsClient } from "aws4fetch";

// Media uploads go to Cloudflare R2 through its S3-compatible API (bucket STORAGE_BUCKET),
// and are served from the bucket's public URL (STORAGE_PUBLIC_URL).
// Server-only: the keys come from the environment and must never reach the browser.
// Import-free apart from aws4fetch so scripts/check-storage.mjs can load it directly.

const env = (key: string) => process.env[key]?.trim() ?? "";

export function storageConfigured() {
  return ["STORAGE_S3_ENDPOINT", "STORAGE_S3_ACCESS_KEY_ID", "STORAGE_S3_SECRET_ACCESS_KEY", "STORAGE_BUCKET", "STORAGE_PUBLIC_URL"].every(
    (k) => env(k) !== ""
  );
}

let client: AwsClient | null = null;
function s3() {
  client ??= new AwsClient({
    accessKeyId: env("STORAGE_S3_ACCESS_KEY_ID"),
    secretAccessKey: env("STORAGE_S3_SECRET_ACCESS_KEY"),
    service: "s3",
    region: env("STORAGE_S3_REGION") || "auto", // R2 uses "auto"
  });
  return client;
}

const encodeKey = (key: string) => key.split("/").map(encodeURIComponent).join("/");
const objectUrl = (key: string) => `${env("STORAGE_S3_ENDPOINT").replace(/\/+$/, "")}/${env("STORAGE_BUCKET")}/${encodeKey(key)}`;
const publicBase = () => env("STORAGE_PUBLIC_URL").replace(/\/+$/, "");

/** Uploads a file and returns its public URL. */
export async function putObject(key: string, body: ArrayBuffer, contentType: string): Promise<string> {
  const res = await s3().fetch(objectUrl(key), {
    method: "PUT",
    body,
    headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000, immutable" },
  });
  if (!res.ok) throw new Error(`Storage upload failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  return `${publicBase()}/${encodeKey(key)}`;
}

/** Deletes a file; a file that is already gone counts as deleted. */
export async function deleteObject(key: string): Promise<void> {
  const res = await s3().fetch(objectUrl(key), { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw new Error(`Storage delete failed (${res.status})`);
}

/** The bucket key behind one of this bucket's public URLs, or null for any other URL. */
export function keyFromUrl(url: string): string | null {
  const base = `${publicBase()}/`;
  return storageConfigured() && url.startsWith(base) ? decodeURIComponent(url.slice(base.length)) : null;
}
