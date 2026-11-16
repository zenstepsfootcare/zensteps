// Run: node --env-file=.env scripts/check-storage.mjs
// Uploads a tiny file to the bucket, reads it back from its public URL, then deletes it.
import assert from "node:assert/strict";
import { deleteObject, keyFromUrl, putObject, storageConfigured } from "../src/lib/storage.ts";

assert.ok(storageConfigured(), "Storage env vars are missing");
const key = `uploads/_check-${Date.now()}.txt`;
const body = new TextEncoder().encode("zen steps storage check");

const url = await putObject(key, body.buffer, "text/plain");
assert.equal(keyFromUrl(url), key);

const res = await fetch(url);
console.log(`public read: HTTP ${res.status}`);
const readable = res.ok && (await res.text()) === "zen steps storage check";

await deleteObject(key);
assert.ok(readable, "Uploaded, but the public URL is not readable: enable the bucket's Public Development URL (r2.dev) in Cloudflare → R2 → Settings");
console.log(`storage check passed (${url.replace(key, "<key>")})`);
