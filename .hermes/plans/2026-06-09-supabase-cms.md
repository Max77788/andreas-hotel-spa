# Supabase CMS for Andreas Hotel Website

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace all hardcoded content (rooms, policies, offers, hero text, gallery, events, site settings) with a Supabase-backed CMS accessible via a password-protected `/admin` page.

**Architecture:** Supabase database with tables for each content type. Next.js pages fetch via server-side Supabase client. Admin page at `/admin` with simple form UI (shadcn components already in the project) — no auth framework, just a shared password stored in env var for speed. Image uploads go to Supabase Storage with public URLs.

**Tech Stack:** Next.js 16 (App Router), Supabase JS client, Supabase Storage, shadcn/ui (already installed), Tailwind CSS

**Key decisions:**
- Password-based admin access (env var) — simplest for a hotel owner who just needs to edit text/photos
- Server Components for public pages (SEO-friendly, ISR-compatible)
- Client Components for admin page (forms, image uploads)
- Supabase Storage bucket for photos (replaces local `/public/hotel-photos/`)

---

## Supabase Schema

### Tables

```sql
-- rooms
CREATE TABLE rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  badge text,
  short_description text,
  long_description text,
  bed text,
  guests text,
  sqft text,
  price text,
  amenities text[], -- array of strings
  extras jsonb, -- [{icon, label}, ...]
  image_url text,
  gallery_urls text[],
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- site_content (page sections like hero, philosophy, story, stats strip)
CREATE TABLE site_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text UNIQUE NOT NULL, -- e.g. 'hero', 'story', 'philosophy', 'booking_bar', 'stats'
  content jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- policies
CREATE TABLE policies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  detail text NOT NULL,
  sort_order integer DEFAULT 0,
  is_highlighted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- offers
CREATE TABLE offers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  duration text,
  price text,
  category text, -- 'one_night' | 'two_night'
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- offer_inclusions
CREATE TABLE offer_inclusions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icon text NOT NULL,
  label text NOT NULL,
  detail text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- events
CREATE TABLE events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tag text, -- 'WELLNESS', 'DINING', etc.
  date_label text NOT NULL, -- e.g. 'APR 12, 2026'
  title text NOT NULL,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- gallery
CREATE TABLE gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  alt text,
  category text DEFAULT 'general',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- site_settings (single-row table for hotel name, phone, address, social links)
CREATE TABLE site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_name text DEFAULT 'The Andreas Hotel & Spa',
  tagline text DEFAULT 'A Sanctuary of Italian-Inspired Elegance',
  address text DEFAULT '277 N. Indian Canyon Drive, Palm Springs, CA',
  phone text DEFAULT '(760) 327-5701',
  email text DEFAULT 'stay@andreashotel.com',
  booking_url text DEFAULT '/book',
  hero_video_url text DEFAULT '/hero-video.mp4',
  logo_dark_url text,
  logo_light_url text,
  updated_at timestamptz DEFAULT now()
);

-- admin_users (optional, for future proper auth)
CREATE TABLE admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);
```

### Storage Bucket

```
Name: photos
Public: true
File size limit: 10MB
Allowed MIME types: image/*
```

---

## Tasks

### Task 1: Install Supabase client and configure env vars

**Objective:** Add `@supabase/supabase-js` and set up environment variables.

**Files:**
- Modify: `package.json`
- Create: `.env.local` (add template vars, never commit actual values)

**Step 1: Install dependency**
```bash
cd /home/max/projects/andreas-hotel-spa
npm install @supabase/supabase-js
```

**Step 2: Add env vars to .env.local**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-shared-admin-password
```

**Step 3: Verify install**
```bash
npm ls @supabase/supabase-js
```

---

### Task 2: Create Supabase client utility

**Objective:** Create server and client-side Supabase clients.

**Files:**
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/client.ts`

**Code:**

`lib/supabase/server.ts`:
```typescript
import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
```

`lib/supabase/client.ts`:
```typescript
import { createClient } from "@supabase/supabase-js";

export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

**Verification:** Check that both files compile with `npx tsc --noEmit`.

---

### Task 3: Create Supabase migration file

**Objective:** Write the SQL migration to create all tables and storage bucket.

**Files:**
- Create: `supabase/migrations/001_cms_tables.sql`

**Content:** Use the full SQL schema from above, plus:
```sql
-- Enable RLS (optional: allow reads from anon, writes from service_role)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_inclusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read access" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON policies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON offers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON offer_inclusions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);
```

**Step 2: Seed initial data**
Create `supabase/migrations/002_seed.sql` with INSERT statements for all current hardcoded data (rooms, policies, offers, events, etc.).

**Verification:** Run the migration against Supabase and verify tables exist.

---

### Task 4: Create type definitions

**Objective:** Define TypeScript types for all content tables.

**Files:**
- Create: `lib/cms/types.ts`

```typescript
export interface Room {
  id: string;
  slug: string;
  name: string;
  badge: string | null;
  short_description: string | null;
  long_description: string | null;
  bed: string | null;
  guests: string | null;
  sqft: string | null;
  price: string | null;
  amenities: string[];
  extras: { icon: string; label: string }[];
  image_url: string | null;
  gallery_urls: string[];
  sort_order: number;
  is_published: boolean;
}

export interface Policy {
  id: string;
  label: string;
  detail: string;
  sort_order: number;
  is_highlighted: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  price: string | null;
  category: "one_night" | "two_night";
  sort_order: number;
  is_published: boolean;
}

export interface OfferInclusion {
  id: string;
  icon: string;
  label: string;
  detail: string | null;
  sort_order: number;
}

export interface Event {
  id: string;
  tag: string | null;
  date_label: string;
  title: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  alt: string | null;
  category: string;
  sort_order: number;
}

export interface SiteContent {
  id: string;
  section_key: string;
  content: Record<string, any>;
}

export interface SiteSettings {
  id: string;
  hotel_name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  booking_url: string;
  hero_video_url: string;
  logo_dark_url: string | null;
  logo_light_url: string | null;
}
```

---

### Task 5: Create CMS data fetching layer

**Objective:** Create server-side functions that fetch CMS data (used by all public pages).

**Files:**
- Create: `lib/cms/queries.ts`

```typescript
import { createServerClient } from "@/lib/supabase/server";
import type { Room, Policy, Offer, OfferInclusion, Event, GalleryImage, SiteSettings } from "./types";

export async function getRooms(): Promise<Room[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getPolicies(): Promise<Policy[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("policies")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getOffers(category?: string): Promise<Offer[]> {
  const supabase = createServerClient();
  let query = supabase.from("offers").select("*").eq("is_published", true);
  if (category) query = query.eq("category", category);
  const { data } = await query.order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getOfferInclusions(): Promise<OfferInclusion[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("offer_inclusions")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getEvents(): Promise<Event[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getGallery(): Promise<GalleryImage[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getSiteContent(sectionKey: string): Promise<Record<string, any>> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("section_key", sectionKey)
    .single();
  return data?.content ?? {};
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .single();
  return data;
}
```

---

### Task 6: Create admin API routes for CRUD operations

**Objective:** Create API endpoints that the admin page calls to save/update content. These use the service_role key (server-side only) for writes.

**Files:**
- Create: `app/api/admin/rooms/route.ts`
- Create: `app/api/admin/policies/route.ts`
- Create: `app/api/admin/offers/route.ts`
- Create: `app/api/admin/events/route.ts`
- Create: `app/api/admin/gallery/route.ts`
- Create: `app/api/admin/site-content/route.ts`
- Create: `app/api/admin/settings/route.ts`
- Create: `app/api/admin/auth/route.ts` (password check)
- Create: `app/api/admin/upload/route.ts` (image upload to Supabase Storage)

**Pattern for each route:**

```typescript
// app/api/admin/rooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data } = await supabase.from("rooms").select("*").order("sort_order");
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();
  const { data, error } = await supabase.from("rooms").upsert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const supabase = createServerClient();
  await supabase.from("rooms").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
```

**Auth endpoint:**
```typescript
// app/api/admin/auth/route.ts
export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return response;
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
```

**Upload endpoint:**
```typescript
// app/api/admin/upload/route.ts
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const supabase = createServerClient();
  const { data, error } = await supabase.storage
    .from("photos")
    .upload(`${Date.now()}-${file.name}`, file);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const url = supabase.storage.from("photos").getPublicUrl(data.path);
  return NextResponse.json({ url: url.data.publicUrl });
}
```

**Step 2: Add admin middleware** to check the `admin_session` cookie on `/admin/*` routes.

---

### Task 7: Build the admin login page

**Objective:** Simple password-only login form that sets a session cookie.

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/layout.tsx`

`app/admin/page.tsx` — a centered card with password input. Submits to `/api/admin/auth`. On success, redirects to `/admin/dashboard`.

---

### Task 8: Build the admin dashboard

**Objective:** Dashboard with navigation cards for each content type (Rooms, Policies, Offers, Events, Gallery, Settings).

**Files:**
- Create: `app/admin/dashboard/page.tsx`

Simple grid of Link cards: "Manage Rooms", "Edit Policies", "Edit Offers", "Events", "Gallery", "Site Settings".

---

### Task 9: Build room editor page

**Objective:** Full CRUD for rooms with image upload fields.

**Files:**
- Create: `app/admin/rooms/page.tsx`

List all rooms in a table with Edit/Delete buttons. "Add Room" button. Edit form modal/drawer with all fields.

---

### Task 10: Build content editor pages (policies, offers, events, gallery, settings)

**Objective:** Simple list + inline edit forms for remaining content types.

**Files:**
- Create: `app/admin/policies/page.tsx`
- Create: `app/admin/offers/page.tsx`
- Create: `app/admin/events/page.tsx`
- Create: `app/admin/gallery/page.tsx`
- Create: `app/admin/settings/page.tsx`

Each page: fetch from API route, render editable list, save via POST/DELETE.

---

### Task 11: Update homepage to fetch from Supabase

**Objective:** Replace hardcoded arrays in `app/page.tsx` with Supabase fetches.

**Files:**
- Modify: `app/page.tsx` — convert to async Server Component
  - Remove `const rooms`, `const events`, `const amenities`, `const galleryImages`, `const stats`, etc.
  - Import `getRooms()`, `getEvents()`, `getGallery()`, `getSiteContent()`, `getSiteSettings()`
  - Fetch data at the top of the component
  - Use fetched data in JSX (same rendering, different data source)
  - `"use client"` → `async` server component for data fetching, client islands for interactive parts (date picker)

**Approach:**
- Keep the page layout identical
- Replace data origins only
- For client-only parts (date picker), wrap in a client component child

---

### Task 12: Update rooms listing page

**Files:**
- Modify: `app/rooms/page.tsx` — fetch from `getRooms()`, remove hardcoded `allRooms` array
- Modify: `app/rooms/[slug]/page.tsx` — fetch from `getRoomBySlug(slug)`, remove hardcoded `rooms` Record

Same rendering, different data source. Keep all styling.

---

### Task 13: Update remaining pages

**Files:**
- Modify: `app/policies/page.tsx` — fetch from `getPolicies()`
- Modify: `app/offers/page.tsx` — fetch from `getOffers()` + `getOfferInclusions()`
- Modify: `app/events/page.tsx` — fetch from `getEvents()`
- Modify: `app/spa/page.tsx` — fetch content from `getSiteContent('spa')`
- Modify: `app/privacy/page.tsx` — fetch from `getSiteContent('privacy')`
- Modify: `app/terms/page.tsx` — fetch from `getSiteContent('terms')`

---

### Task 14: Add revalidation (ISR) support

**Objective:** Pages should revalidate after admin edits.

**Files:**
- Modify: `app/api/admin/*` routes — each POST/PUT/DELETE calls `revalidatePath()` for affected pages

```typescript
import { revalidatePath } from "next/cache";

// In POST handler after successful save:
revalidatePath("/");
revalidatePath("/rooms");
revalidatePath(`/rooms/${body.slug}`);
```

---

### Task 15: Seed database with current content

**Objective:** Create a seed script that migrates all hardcoded data into Supabase.

**Files:**
- Create: `scripts/seed-cms.ts`

Reads current hardcoded data from page files and inserts into Supabase. Optionally, write manual INSERT SQL as part of migration `002_seed.sql`.

---

### Task 16: Test and deploy

**Objective:** Verify all pages load from Supabase, admin panel works, revalidation triggers.

**Verification:**
1. Run `npm run build` — should compile without errors
2. Visit homepage — should display same content as before
3. Visit `/admin` — login with password
4. Edit a room description, save
5. Visit room page — should show updated text
6. Push to Vercel and verify production

---

## Execution Order

1. Tasks 1-4: Infrastructure (deps, schema, types)
2. Tasks 5-6: Data layer (queries, API routes)
3. Tasks 7-10: Admin UI (login, dashboard, editors)
4. Tasks 11-13: Migrate public pages to Supabase
5. Tasks 14-15: Revalidation + seeding
6. Task 16: Test + deploy

---

## Pitfalls to Avoid

- **Don't break SSR/SEO**: All public pages remain Server Components. Only admin pages are client-side.
- **Don't leak service_role key**: It lives in `.env.local` and is only used in `lib/supabase/server.ts` (server-only). Never import it in client components.
- **Don't over-engineer auth**: A shared password is enough for a hotel owner. No OAuth, no user management.
- **Keep the existing design intact**: Only change data sources, never styles or layout.
