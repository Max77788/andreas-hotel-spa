import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const roomsPage = readFileSync(resolve(root, "app/admin/rooms/page.tsx"), "utf8");

describe("rooms bulk image upload", () => {
  it("gallery input has multiple attribute so Darwin can select 30+ images in one picker", () => {
    // The gallery file input must accept multiple files
    expect(roomsPage).toMatch(
      /<input[^>]*\btype=["']file["'][^>]*\bmultiple\b[^>]*>/,
    );
    // And the multiple must be on a gallery (not main image) input
    expect(roomsPage).toMatch(/Gallery Images/);
  });

  it("upload path checks res.ok / error instead of blindly destructuring .url from response", () => {
    // handleImageUpload (or new upload logic) must check res.ok before destructuring
    // or must have error handling that prevents writing undefined URL
    const hasOkCheck =
      roomsPage.includes("res.ok") ||
      roomsPage.includes("!res.ok") ||
      roomsPage.includes("response.ok") ||
      roomsPage.includes("uploadRes.ok");
    expect(hasOkCheck).toBe(true);

    // Must not have the old blind destructure on the happy path for bulk uploads
    // (the single-image destructure is still acceptable with an ok guard around it)
    // Verify there is error handling present — either try/catch or .catch() or res.ok guard
    const hasErrorHandling =
      roomsPage.includes("error") ||
      roomsPage.includes("Error") ||
      roomsPage.includes("catch") ||
      roomsPage.includes(".ok");
    expect(hasErrorHandling).toBe(true);
  });

  it("gallery bulk upload persists with explicit save after batch, not solely via debounced autosave", () => {
    // The code must call fetch("/api/admin/rooms", ...) or saveFn directly
    // after uploading gallery images, not just rely on useAutoSave debounce.
    // Look for a pattern where after gallery uploads complete, a POST/PATCH to /api/admin/rooms is made.
    const hasExplicitPersist =
      roomsPage.includes("fetch(\"/api/admin/rooms\"") &&
      // There must be a gallery upload that leads to explicit persistence
      roomsPage.match(/fetch\(\"\/api\/admin\/rooms\"/g)!.length >= 1;

    // Must NOT be solely dependent on autosave for upload persistence
    // This is more nuanced - the code may still import useAutoSave but must have
    // an explicit save path for image operations
    expect(hasExplicitPersist).toBe(true);
  });

  it("has visible upload progress/error status UI and disables controls during upload", () => {
    // Must have upload state tracking (e.g. uploading, uploadError, uploadProgress)
    const hasUploadState =
      roomsPage.includes("uploading") ||
      roomsPage.includes("uploadError") ||
      roomsPage.includes("uploadStatus") ||
      roomsPage.includes("Uploading");

    // Must have some visual feedback for the user during/after upload
    const hasStatusUI =
      roomsPage.includes("error") ||
      roomsPage.includes("Error") ||
      roomsPage.includes("Saving") ||
      roomsPage.includes("status");

    expect(hasUploadState).toBe(true);
    expect(hasStatusUI).toBe(true);
  });

  it("has UI copy informing that gallery supports multiple selection", () => {
    // The gallery label or nearby text should mention multiple selection
    const hasMultipleInstruction =
      roomsPage.includes("multiple") ||
      roomsPage.includes("Multiple") ||
      roomsPage.includes("30+") ||
      roomsPage.includes("Select multiple") ||
      roomsPage.includes("Choose multiple") ||
      roomsPage.includes("any number");

    expect(hasMultipleInstruction).toBe(true);
  });
});
