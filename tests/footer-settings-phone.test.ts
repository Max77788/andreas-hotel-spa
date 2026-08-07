import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("footer phone setting", () => {
  it("loads the public footer phone from the CMS settings row", () => {
    const footer = read("components/footer.tsx");

    expect(footer).toMatch(/createClient\(url, key, \{ db: \{ schema: "andreas_website" \} \}\)/);
    expect(footer).toMatch(/\.from\("site_settings"\)[\s\S]*\.select\("address, phone, email"\)/);
    expect(footer).toMatch(/if \(data\.phone\) setPhone\(data\.phone\)/);
    expect(footer).toMatch(/href=\{`tel:\$\{phone\.replace\(/);
    expect(footer).toMatch(/\{phone\}/);
    expect(footer).not.toMatch(/phone1|phone2/);
  });

  it("persists the admin Settings phone field", () => {
    const settingsEditor = read("app/admin/settings/page.tsx");
    const settingsRoute = read("app/api/admin/settings/route.ts");

    expect(settingsEditor).toMatch(/\{ key: "phone", label: "Phone" \}/);
    expect(settingsRoute).toMatch(/address: body\.address, phone: body\.phone, email: body\.email/);
  });
});
