import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const homepage = readFileSync(resolve(root, "app/page.tsx"), "utf8");
const settingsEditor = readFileSync(resolve(root, "app/admin/settings/page.tsx"), "utf8");

describe("award image URL resilience", () => {
  it("filters blank and whitespace-only award images on the homepage", () => {
    expect(homepage).toMatch(
      /const validCmsAwards = \(cmsAwards \?\? \[\]\)\.flatMap\(\(award\) => \{[\s\S]*const image_url = award\.image_url\?\.trim\(\);[\s\S]*return image_url \? \[\{ \.\.\.award, image_url \}\] : \[\];[\s\S]*\}\);/
    );
    expect(homepage).toMatch(/validCmsAwards\.length > 0 \? validCmsAwards\.map/);
    expect(homepage).not.toMatch(
      /cmsAwards as \{ image_url: string; link_url: string; alt_text: string \}\[\]\)\.map/
    );
  });

  it("does not render admin previews for whitespace-only image URLs", () => {
    expect(settingsEditor.match(/award\.image_url\?\.trim\(\)/g)).toHaveLength(2);
    expect(settingsEditor.match(/src=\{award\.image_url\.trim\(\)\}/g)).toHaveLength(2);
  });

  it("explains direct external image URL requirements in the CMS", () => {
    expect(settingsEditor).toMatch(/>Image URL<\/span>/);
    expect(settingsEditor).toMatch(
      /direct \.png, \.jpg, or \.webp URL, not a webpage URL; use upload for old or unreliable third-party URLs\./
    );
  });
});
