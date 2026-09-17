import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync("components/vapi-custom-chat.tsx", "utf8");

describe("Vapi chat message scrolling", () => {
  it("scrolls the messages container instead of the page window", () => {
    expect(source).toMatch(/messagesContainerRef/);
    expect(source).toMatch(/messagesContainerRef\.current\.scrollTop\s*=\s*messagesContainerRef\.current\.scrollHeight/);
    expect(source).not.toMatch(/window\.scrollTo|scrollIntoView/);
  });
});
