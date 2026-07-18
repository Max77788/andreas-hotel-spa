# Andreas awards external URL resilience

## Root cause
The CMS accepts direct third-party image URLs. The specific old URL `https://andreashotel.com/wp-content/uploads/2017/10/andreas-tripadvisor-awards-2.png` is a real PNG but the old domain has an expired TLS certificate, so browsers reject it. The CMS also contained a second fully blank award row. The homepage rendered every row, including rows with an empty `image_url`, producing another broken image.

The production CMS data has already been repaired to use the identical bundled asset `/hotel-photos/tripadvisor-award.png` and the blank row has been removed.

## Code task
Make the homepage award rendering resilient so blank/incomplete CMS award rows never create broken images. Improve the admin wording so editors understand that the Image field accepts a direct image file URL, not a normal webpage URL, and that the upload button is preferred for old or unreliable third-party assets.

## Requirements
1. In `app/page.tsx`, derive/render only awards whose `image_url` is non-empty after trimming.
2. Preserve valid external direct image URL support and local image paths.
3. Preserve each award's optional `link_url` behavior and alt text.
4. Do not render an anchor with a broken/empty image for blank rows.
5. In `app/admin/settings/page.tsx`, relabel `Image` to `Image URL` and update help text to explicitly say: direct `.png`, `.jpg`, or `.webp` URL, not a webpage URL; use upload for old/unreliable third-party URLs.
6. Do not change unrelated functionality or files.
7. Add a focused static regression test under `tests/` proving blank image URLs are filtered and the admin guidance is present. Demonstrate RED before implementation and GREEN after.
8. No em dashes in new copy.

## Required verification
- `node tests/<new-focused-test>.mjs`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`

## Likely files
- `app/page.tsx`
- `app/admin/settings/page.tsx`
- `tests/awards-image-url-resilience.test.mjs`
