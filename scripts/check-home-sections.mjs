// Run: node scripts/check-home-sections.mjs   (Node 23.6+ strips the TS types)
import assert from "node:assert/strict";
import { parseSocialUrl, sectionSettings, SECTION_DEFAULTS } from "../src/lib/homeSections.ts";

const id = "aBcDeFgHiJk";
for (const url of [
  `https://www.youtube.com/watch?v=${id}`,
  `https://www.youtube.com/watch?feature=share&v=${id}`,
  `https://youtu.be/${id}?si=x`,
  `https://youtube.com/shorts/${id}`,
  `https://www.youtube.com/embed/${id}`,
]) {
  const r = parseSocialUrl(url);
  assert.equal(r?.platform, "youtube", url);
  assert.ok(r.embedUrl.includes(`/embed/${id}`), url);
  assert.equal(r.thumbnail, `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
}
assert.equal(parseSocialUrl(`https://youtube.com/shorts/${id}`).vertical, true);
assert.equal(parseSocialUrl(`https://youtu.be/${id}`).vertical, false);

for (const [url, embed] of [
  ["https://www.instagram.com/reel/C1a2B3c4D5e/?igsh=abc", "https://www.instagram.com/reel/C1a2B3c4D5e/embed/"],
  ["https://www.instagram.com/reels/C1a2B3c4D5e/", "https://www.instagram.com/reel/C1a2B3c4D5e/embed/"],
  ["https://instagram.com/p/XyZ_123-ab/", "https://www.instagram.com/p/XyZ_123-ab/embed/"],
  ["https://www.instagram.com/zensteps/reel/C1a2B3c4D5e/", "https://www.instagram.com/reel/C1a2B3c4D5e/embed/"],
]) {
  const r = parseSocialUrl(url);
  assert.equal(r?.platform, "instagram", url);
  assert.equal(r.embedUrl, embed);
}

assert.equal(parseSocialUrl("https://example.com/video"), null);
assert.equal(parseSocialUrl("https://www.instagram.com/zensteps/"), null);

const s = sectionSettings([
  { key: "benefitsTitle", value: "  Custom  " },
  { key: "socialTitle", value: "   " },
  { key: "unknownKey", value: "x" },
]);
assert.equal(s.benefitsTitle, "Custom");
assert.equal(s.socialTitle, SECTION_DEFAULTS.socialTitle);
assert.ok(!("unknownKey" in s));

console.log("home-sections checks passed");
