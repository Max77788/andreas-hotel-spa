# Andreas Homepage Feedback Fixes Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Make the homepage gallery genuinely interactive, remove duplicated room currency symbols, and fix the stylized Andreas “A” alignment and responsive wrapping across Spa, amenities, and contact sections.

**Architecture:** Keep the existing visual system and CMS data model. Create one reusable inline brand-initial component so headings use the same baseline, size, and no-wrap behavior instead of independent image-class tweaks. Keep the homepage gallery intentionally capped for performance, but make every visible tile open the existing lightbox and provide a clear route to the full gallery.

**Tech Stack:** Next.js 16, React, Tailwind CSS, existing gallery/lightbox component, existing room/CMS data.

---

### Task 1: Audit and repair homepage gallery click targets

**Files:**
- Modify: `app/page.tsx` - homepage gallery section near `Our Gallery`
- Inspect/modify: existing lightbox/gallery component used by the homepage
- Test: add or extend a homepage interaction test under `tests/`

**Steps:**
1. Write a failing interaction test proving each visible gallery tile is a keyboard-accessible button/link and opens the lightbox on click/Enter.
2. Inspect stacking contexts, overlays, `pointer-events`, and modal state wiring. The feedback shows a hover affordance but no real click action.
3. Make the entire image tile the interactive target, with `aria-label="Open photo N"`, visible focus styling, and `cursor-pointer` only when the handler exists.
4. Keep homepage preview capped at 6 images on desktop and 4 on mobile. Do not silently hide the rest.
5. Add a visible `View full gallery` CTA when additional images exist, pointing to the full gallery route/section.
6. Verify mouse, keyboard, Escape-to-close, and mobile tap behavior.

**Acceptance:** Hover/cursor, click/tap, and keyboard activation all open the exact selected photo. The homepage exposes no more than the preview cap, while users can reach all photos.

### Task 2: Normalize room-price rendering

**Files:**
- Modify: `app/page.tsx` - room card price block
- Inspect: room data/CMS mapper that supplies `room.price`
- Test: add a regression test for values such as `$599` and `599`

**Steps:**
1. Write failing tests for both stored price formats.
2. Introduce one display formatter that strips leading currency symbols before adding exactly one `$`, or renders the stored formatted price directly consistently.
3. Use it for every homepage room card. Do not mutate CMS data or alter actual pricing.
4. Verify desktop and mobile cards show `$599`, never `$$599`.

**Acceptance:** Every card has one and only one currency symbol, regardless of legacy CMS string format.

### Task 3: Create a reusable inline Andreas initial

**Files:**
- Create: `components/andreas-initial.tsx`
- Modify: `app/page.tsx`
- Modify: `app/spa/page.tsx`
- Test: component and responsive visual regression coverage where supported

**Steps:**
1. Build a small component wrapping `/andreas_logo_a_white.png` in an `inline-flex whitespace-nowrap` word fragment.
2. Give it explicit responsive height, line-height, baseline/translate adjustment, and tightly controlled side margins via props or variants.
3. Use semantic accessible text, such as visually-hidden `A`, rather than exposing an isolated decorative image to screen readers.
4. Replace the separate raw `<img>` snippets in amenities, contact, and Spa headings.

**Acceptance:** The stylized A visually belongs to its word, has no large gap, and remains aligned at all breakpoints.

### Task 4: Repair Spa hero desktop and mobile composition

**Files:**
- Modify: `app/spa/page.tsx` around the `Spa at The Andreas` hero heading
- Test: mobile and desktop visual/manual viewport checks

**Steps:**
1. Write a viewport-focused regression test or screenshot assertion for 375px and desktop widths.
2. Make `Andreas` an unbreakable inline word fragment using the shared component.
3. Permit intentional line breaks only between phrase groups: `Spa at The` and `Andreas`, never inside `Andreas` and never as `Spa Andreas at The`.
4. Adjust hero font scale, line height, max width, and A baseline separately for mobile rather than relying on desktop wrapping.
5. Confirm the title does not collide with description text or the booking CTA.

**Acceptance:** Desktop reads naturally as `Spa at The Andreas`; mobile keeps the phrase order and has no detached A or accidental word reordering.

### Task 5: Repair amenities and contact heading wrapping

**Files:**
- Modify: `app/page.tsx` around `Hotel Amenities` and `Your Desert Escape Awaits`
- Test: homepage mobile viewport regression test

**Steps:**
1. Apply the shared initial component to `Hotel Amenities` and `Awaits`.
2. Keep `Amenities` and `Awaits` as no-wrap word fragments.
3. Define intentional mobile line breaks for the surrounding copy rather than letting the logo image dictate wrapping.
4. Verify the green amenities card and dark contact card at 320px, 375px, 430px, and desktop widths.

**Acceptance:** No heading displays `A menities` or `A waits`; typography retains the editorial design without overflow or collision.

### Task 6: Quality gates, release, and visual verification

**Files:**
- No additional production files expected

**Steps:**
1. Run targeted tests for gallery, price formatter, and inline-brand component.
2. Run `npm test` and `npm run build`.
3. Check the deployed homepage at desktop and 375px/430px widths, including gallery lightbox operation.
4. Commit with focused messages and deploy to Vercel.
5. Report the deployed URL and before/after screenshots for the gallery, rooms price, Spa hero, amenities, and contact sections.

**Acceptance:** Build passes, deployed site is live, all four screenshot-reported issues are visually verified on desktop and mobile.
