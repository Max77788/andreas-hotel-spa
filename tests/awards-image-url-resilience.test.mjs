import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const homepage = readFileSync(resolve(root, "app/page.tsx"), "utf8");
const settingsEditor = readFileSync(resolve(root, "app/admin/settings/page.tsx"), "utf8");

assert.match(
  homepage,
  /const validCmsAwards = \(cmsAwards \?\? \[\]\)\.flatMap\(\(award\) => \{[\s\S]*const image_url = award\.image_url\?\.trim\(\);[\s\S]*return image_url \? \[\{ \.\.\.award, image_url \}\] : \[\];[\s\S]*\}\);/
);
assert.match(homepage, /validCmsAwards\.length > 0 \? validCmsAwards\.map/);
assert.doesNotMatch(homepage, /cmsAwards as \{ image_url: string; link_url: string; alt_text: string \}\[\]\)\.map/);
assert.match(settingsEditor, />Image URL<\/span>/);
assert.match(
  settingsEditor,
  /direct \.png, \.jpg, or \.webp URL, not a webpage URL; use upload for old or unreliable third-party URLs\./
);
console.log("Award image URL resilience regression checks passed.");
