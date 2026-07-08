import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";

// ── Types ────────────────────────────────────────────

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  passwordHash: string;
  resetToken?: string;
  resetTokenExpiresAt?: number;
}

// ── Supabase config ───────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://phgogybfgovrlcdmifpv.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SCHEMA = "andreas_website";
const TABLE = "admin_users";

function supaHeaders() {
  return {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    "Accept-Profile": SCHEMA,
    "Content-Profile": SCHEMA,
    "Content-Type": "application/json",
  };
}

function supaUrl(path: string) {
  return `${SUPABASE_URL}/rest/v1/${path}`;
}

// ── JSON file fallback (for local dev / before Supabase table exists) ──

const SEED_PATH = path.join(process.cwd(), "data", "admin-users.json");
const STORE_PATH = process.env.VERCEL
  ? path.join("/tmp", "admin-users.json")
  : SEED_PATH;

function ensureDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJsonStore(): AdminUser[] {
  ensureDir();
  if (!fs.existsSync(STORE_PATH)) {
    if (fs.existsSync(SEED_PATH)) {
      const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
      fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2));
      return seed;
    }
    return [];
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
}

function writeJsonStore(users: AdminUser[]) {
  ensureDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(users, null, 2));
}

// ── Determine if Supabase is available ──

let _supaAvailable: boolean | null = null;

let _supaCheckInFlight: Promise<boolean> | null = null;

async function checkSupabaseTable(): Promise<boolean> {
  // Return cached successful result immediately
  if (_supaAvailable === true) return true;
  // If a check is already in flight, wait for it (prevents thundering herd)
  if (_supaCheckInFlight) return _supaCheckInFlight;
  if (!SUPABASE_SERVICE_KEY) {
    _supaAvailable = false;
    return false;
  }

  _supaCheckInFlight = (async () => {
    try {
      const res = await fetch(supaUrl(`${TABLE}?limit=1`), {
        headers: supaHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      _supaAvailable = res.ok;
      return _supaAvailable;
    } catch {
      // Do NOT cache failures — reset to null so the next call retries.
      // Transient network issues on Vercel cold starts should not permanently
      // disable Supabase access.
      _supaAvailable = null;
      return false;
    } finally {
      _supaCheckInFlight = null;
    }
  })();

  return _supaCheckInFlight;
}

function resetSupaCheck() {
  _supaAvailable = null;
  _supaCheckInFlight = null;
}

// ── Crypto helpers ───────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(password, await bcrypt.genSalt(12));
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hash);
}

// ── AdminUser ↔ DB row mapping ──

function dbToAdminUser(row: any): AdminUser {
  return {
    _id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    passwordHash: row.password_hash,
    resetToken: row.reset_token || undefined,
    resetTokenExpiresAt: row.reset_token_expires_at || undefined,
  };
}

function adminUserToDb(user: AdminUser): any {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    password_hash: user.passwordHash,
    reset_token: user.resetToken || null,
    reset_token_expires_at: user.resetTokenExpiresAt || null,
  };
}

// ── Public API (Supabase primary, JSON fallback) ──

export async function listUsers(): Promise<AdminUser[]> {
  // Try Supabase first
  if (await checkSupabaseTable()) {
    try {
      const res = await fetch(
        supaUrl(`${TABLE}?select=id,email,name,role,password_hash,reset_token,reset_token_expires_at&order=name`),
        { headers: supaHeaders(), signal: AbortSignal.timeout(5000) }
      );
      if (res.ok) {
        const rows = await res.json();
        const users = rows.map(dbToAdminUser);
        // Sync to JSON cache (repatriates on cold start)
        if (users.length) {
          try { writeJsonStore(users); } catch {}
        }
        return users;
      }
    } catch {}
  }
  // Fallback to JSON
  return readJsonStore();
}

export async function findByEmail(email: string): Promise<AdminUser | null> {
  // Try Supabase first
  if (await checkSupabaseTable()) {
    try {
      const res = await fetch(
        supaUrl(`${TABLE}?email=eq.${encodeURIComponent(email.toLowerCase().trim())}&limit=1`),
        { headers: supaHeaders() }
      );
      if (res.ok) {
        const rows = await res.json();
        if (rows.length) return dbToAdminUser(rows[0]);
      }
    } catch {}
  }
  // Fallback to JSON
  return readJsonStore().find((u) => u.email === email.toLowerCase().trim()) || null;
}

export async function verifyLogin(
  email: string,
  password: string
): Promise<{ user: AdminUser } | { error: string }> {
  const user = await findByEmail(email);
  if (!user) return { error: "Invalid email or password" };
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password" };
  return { user };
}

export async function createUser(args: {
  email: string;
  name: string;
  password: string;
  role: "admin" | "editor";
}): Promise<{ userId: string; error?: string }> {
  const email = args.email.toLowerCase().trim();
  const passwordHash = await hashPassword(args.password);
  const userId = randomUUID();

  // Try Supabase first (primary)
  if (await checkSupabaseTable()) {
    try {
      const res = await fetch(supaUrl(TABLE), {
        method: "POST",
        headers: supaHeaders(),
        body: JSON.stringify({
          id: userId,
          email,
          name: args.name,
          role: args.role,
          password_hash: passwordHash,
        }),
      });
      if (res.ok) {
        // Also sync to JSON store as fallback cache
        const jsonUsers = readJsonStore();
        const existing = jsonUsers.findIndex((u) => u._id === userId);
        if (existing === -1) {
          jsonUsers.push({ _id: userId, email, name: args.name, role: args.role, passwordHash });
          writeJsonStore(jsonUsers);
        } else {
          jsonUsers[existing] = { _id: userId, email, name: args.name, role: args.role, passwordHash };
          writeJsonStore(jsonUsers);
        }
        return { userId };
      }
      const errData = await res.json();
      if (res.status === 409) {
        return { userId: "", error: "A user with this email already exists" };
      }
      console.warn("Supabase createUser failed, falling back to JSON:", errData);
    } catch (err) {
      console.warn("Supabase createUser error, falling back to JSON:", err);
    }
  }

  // JSON fallback
  const users = readJsonStore();
  if (users.find((u) => u.email === email)) {
    return { userId: "", error: "A user with this email already exists" };
  }
  users.push({ _id: userId, email, name: args.name, role: args.role, passwordHash });
  writeJsonStore(users);
  return { userId };
}

export async function updateUser(
  userId: string,
  updates: { name?: string; role?: "admin" | "editor" }
): Promise<{ error?: string }> {
  // Supabase primary
  if (await checkSupabaseTable()) {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.role !== undefined) payload.role = updates.role;
    try {
      const res = await fetch(supaUrl(`${TABLE}?id=eq.${userId}`), {
        method: "PATCH",
        headers: supaHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        // Sync to JSON cache
        const users = readJsonStore();
        const idx = users.findIndex((u) => u._id === userId);
        if (idx !== -1) {
          if (updates.name !== undefined) users[idx].name = updates.name;
          if (updates.role !== undefined) users[idx].role = updates.role;
          writeJsonStore(users);
        }
        return {};
      }
      console.warn("Supabase updateUser failed, falling back to JSON");
    } catch (err) {
      console.warn("Supabase updateUser error, falling back to JSON:", err);
    }
  }

  // JSON fallback
  const users = readJsonStore();
  const idx = users.findIndex((u) => u._id === userId);
  if (idx === -1) return { error: "User not found" };
  if (updates.name !== undefined) users[idx].name = updates.name;
  if (updates.role !== undefined) users[idx].role = updates.role;
  writeJsonStore(users);
  return {};
}

export async function deleteUser(userId: string): Promise<{ error?: string }> {
  // Supabase primary
  if (await checkSupabaseTable()) {
    try {
      const res = await fetch(supaUrl(`${TABLE}?id=eq.${userId}`), {
        method: "DELETE",
        headers: supaHeaders(),
      });
      if (res.ok || res.status === 204) {
        // Sync to JSON cache
        const users = readJsonStore();
        const idx = users.findIndex((u) => u._id === userId);
        if (idx !== -1) {
          users.splice(idx, 1);
          writeJsonStore(users);
        }
        return {};
      }
      console.warn("Supabase deleteUser failed, falling back to JSON");
    } catch (err) {
      console.warn("Supabase deleteUser error, falling back to JSON:", err);
    }
  }

  // JSON fallback
  const users = readJsonStore();
  const idx = users.findIndex((u) => u._id === userId);
  if (idx === -1) return { error: "User not found" };
  users.splice(idx, 1);
  writeJsonStore(users);
  return {};
}

export async function generateResetToken(
  email: string
): Promise<{ token: string; user: AdminUser } | null> {
  const crypto = await import("crypto");
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 3600 * 1000;

  // Supabase primary
  if (await checkSupabaseTable()) {
    try {
      // First get the user from Supabase
      const res = await fetch(
        supaUrl(`${TABLE}?email=eq.${encodeURIComponent(email.toLowerCase().trim())}&limit=1`),
        { headers: supaHeaders() }
      );
      if (res.ok) {
        const rows = await res.json();
        if (rows.length) {
          const user = dbToAdminUser(rows[0]);
          // Update the reset token in Supabase
          await fetch(supaUrl(`${TABLE}?id=eq.${user._id}`), {
            method: "PATCH",
            headers: supaHeaders(),
            body: JSON.stringify({ reset_token: token, reset_token_expires_at: expiresAt }),
          });
          // Sync to JSON cache
          const jsonUsers = readJsonStore();
          const idx = jsonUsers.findIndex((u) => u.email === email.toLowerCase().trim());
          if (idx !== -1) {
            jsonUsers[idx].resetToken = token;
            jsonUsers[idx].resetTokenExpiresAt = expiresAt;
            writeJsonStore(jsonUsers);
          }
          return { token, user };
        }
      }
    } catch (err) {
      console.warn("Supabase generateResetToken error, falling back to JSON:", err);
    }
  }

  // JSON fallback
  const users = readJsonStore();
  const idx = users.findIndex((u) => u.email === email.toLowerCase().trim());
  if (idx === -1) return null;
  users[idx].resetToken = token;
  users[idx].resetTokenExpiresAt = expiresAt;
  writeJsonStore(users);
  return { token, user: users[idx] };
}

export async function resetPassword(
  token: string,
  password: string
): Promise<{ error?: string }> {
  const passwordHash = await hashPassword(password);

  // Supabase primary
  if (await checkSupabaseTable()) {
    try {
      const res = await fetch(
        supaUrl(`${TABLE}?reset_token=eq.${token}&select=id`),
        { headers: supaHeaders() }
      );
      if (res.ok) {
        const rows = await res.json();
        if (rows.length) {
          const userId = rows[0].id;
          const updateRes = await fetch(supaUrl(`${TABLE}?id=eq.${userId}`), {
            method: "PATCH",
            headers: supaHeaders(),
            body: JSON.stringify({
              password_hash: passwordHash,
              reset_token: null,
              reset_token_expires_at: null,
            }),
          });
          if (updateRes.ok) {
            // Sync to JSON cache
            const jsonUsers = readJsonStore();
            const idx = jsonUsers.findIndex((u) => u._id === userId);
            if (idx !== -1) {
              jsonUsers[idx].passwordHash = passwordHash;
              delete jsonUsers[idx].resetToken;
              delete jsonUsers[idx].resetTokenExpiresAt;
              writeJsonStore(jsonUsers);
            }
            return {};
          }
        }
      }
    } catch (err) {
      console.warn("Supabase resetPassword error, falling back to JSON:", err);
    }
  }

  // JSON fallback
  const users = readJsonStore();
  const idx = users.findIndex(
    (u) => u.resetToken === token && u.resetTokenExpiresAt && u.resetTokenExpiresAt > Date.now()
  );
  if (idx === -1) return { error: "Invalid or expired reset token" };
  users[idx].passwordHash = passwordHash;
  delete users[idx].resetToken;
  delete users[idx].resetTokenExpiresAt;
  writeJsonStore(users);
  return {};
}

export async function setPassword(
  userId: string,
  password: string
): Promise<{ error?: string }> {
  const passwordHash = await hashPassword(password);

  // Supabase primary
  if (await checkSupabaseTable()) {
    try {
      const res = await fetch(supaUrl(`${TABLE}?id=eq.${userId}`), {
        method: "PATCH",
        headers: supaHeaders(),
        body: JSON.stringify({ password_hash: passwordHash }),
      });
      if (res.ok) {
        // Sync to JSON cache
        const jsonUsers = readJsonStore();
        const idx = jsonUsers.findIndex((u) => u._id === userId);
        if (idx !== -1) {
          jsonUsers[idx].passwordHash = passwordHash;
          writeJsonStore(jsonUsers);
        }
        return {};
      }
    } catch (err) {
      console.warn("Supabase setPassword error, falling back to JSON:", err);
    }
  }

  // JSON fallback
  const users = readJsonStore();
  const idx = users.findIndex((u) => u._id === userId);
  if (idx === -1) return { error: "User not found" };
  users[idx].passwordHash = passwordHash;
  writeJsonStore(users);
  return {};
}
