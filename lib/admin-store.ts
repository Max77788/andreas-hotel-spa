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

function supabaseHeaders() {
  return {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    "Accept-Profile": SCHEMA,
    "Content-Type": "application/json",
  };
}

function supabaseUrl(path: string) {
  return `${SUPABASE_URL}/rest/v1/${path}`;
}

// ── JSON file fallback (for before migration is run) ──

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

async function checkSupabaseTable(): Promise<boolean> {
  if (_supaAvailable !== null) return _supaAvailable;
  try {
    const res = await fetch(supabaseUrl(`${TABLE}?limit=1`), {
      headers: supabaseHeaders(),
      signal: AbortSignal.timeout(3000),
    });
    _supaAvailable = res.ok;
    return _supaAvailable;
  } catch {
    _supaAvailable = false;
    return false;
  }
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

// ── Public API ───────────────────────────────────────

export async function findByEmail(email: string): Promise<AdminUser | null> {
  if (await checkSupabaseTable()) {
    try {
      const res = await fetch(
        supabaseUrl(`${TABLE}?email=eq.${encodeURIComponent(email.toLowerCase().trim())}&limit=1`),
        { headers: supabaseHeaders() }
      );
      if (res.ok) {
        const rows = await res.json();
        return rows.length ? dbToAdminUser(rows[0]) : null;
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

export function listUsers(): AdminUser[] {
  // Always use JSON for listing (fast, cached)
  const users = readJsonStore();
  if (users.length > 0) {
    return users.map(({ passwordHash, resetToken, resetTokenExpiresAt, ...rest }) => rest as AdminUser);
  }
  return [];
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

  // Try Supabase first
  if (await checkSupabaseTable()) {
    try {
      const res = await fetch(supabaseUrl(TABLE), {
        method: "POST",
        headers: supabaseHeaders(),
        body: JSON.stringify({
          id: userId,
          email,
          name: args.name,
          role: args.role,
          password_hash: passwordHash,
        }),
      });
      if (res.ok) {
        // Also add to JSON store for listUsers()
        const jsonUsers = readJsonStore();
        if (!jsonUsers.find((u) => u.email === email)) {
          jsonUsers.push({ _id: userId, email, name: args.name, role: args.role, passwordHash });
          writeJsonStore(jsonUsers);
        }
        return { userId };
      }
      const errData = await res.json();
      if (res.status === 409) {
        return { userId: "", error: "A user with this email already exists" };
      }
      // Fall through to JSON fallback
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

export function updateUser(
  userId: string,
  updates: { name?: string; role?: "admin" | "editor" }
): { error?: string } {
  const users = readJsonStore();
  const idx = users.findIndex((u) => u._id === userId);
  if (idx === -1) return { error: "User not found" };
  if (updates.name !== undefined) users[idx].name = updates.name;
  if (updates.role !== undefined) users[idx].role = updates.role;
  writeJsonStore(users);

  // Also try Supabase (fire-and-forget)
  if (_supaAvailable) {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.role !== undefined) payload.role = updates.role;
    fetch(supabaseUrl(`${TABLE}?id=eq.${userId}`), {
      method: "PATCH",
      headers: supabaseHeaders(),
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  return {};
}

export function deleteUser(userId: string): { error?: string } {
  const users = readJsonStore();
  const idx = users.findIndex((u) => u._id === userId);
  if (idx === -1) return { error: "User not found" };
  users.splice(idx, 1);
  writeJsonStore(users);

  // Also try Supabase (fire-and-forget)
  if (_supaAvailable) {
    fetch(supabaseUrl(`${TABLE}?id=eq.${userId}`), {
      method: "DELETE",
      headers: supabaseHeaders(),
    }).catch(() => {});
  }

  return {};
}

export async function generateResetToken(
  email: string
): Promise<{ token: string; user: AdminUser } | null> {
  const users = readJsonStore();
  const idx = users.findIndex((u) => u.email === email.toLowerCase().trim());
  if (idx === -1) return null;

  const crypto = await import("crypto");
  const token = crypto.randomBytes(32).toString("hex");
  users[idx].resetToken = token;
  users[idx].resetTokenExpiresAt = Date.now() + 3600 * 1000;
  writeJsonStore(users);

  // Also try Supabase
  if (_supaAvailable) {
    fetch(supabaseUrl(`${TABLE}?id=eq.${users[idx]._id}`), {
      method: "PATCH",
      headers: supabaseHeaders(),
      body: JSON.stringify({
        reset_token: token,
        reset_token_expires_at: Date.now() + 3600 * 1000,
      }),
    }).catch(() => {});
  }

  return { token, user: users[idx] };
}

export async function resetPassword(
  token: string,
  password: string
): Promise<{ error?: string }> {
  const users = readJsonStore();
  const idx = users.findIndex(
    (u) => u.resetToken === token && u.resetTokenExpiresAt && u.resetTokenExpiresAt > Date.now()
  );
  if (idx === -1) return { error: "Invalid or expired reset token" };

  users[idx].passwordHash = await hashPassword(password);
  delete users[idx].resetToken;
  delete users[idx].resetTokenExpiresAt;
  writeJsonStore(users);

  // Also try Supabase
  if (_supaAvailable) {
    fetch(supabaseUrl(`${TABLE}?id=eq.${users[idx]._id}`), {
      method: "PATCH",
      headers: supabaseHeaders(),
      body: JSON.stringify({
        password_hash: users[idx].passwordHash,
        reset_token: null,
        reset_token_expires_at: null,
      }),
    }).catch(() => {});
  }

  return {};
}

export async function setPassword(
  userId: string,
  password: string
): Promise<{ error?: string }> {
  const users = readJsonStore();
  const idx = users.findIndex((u) => u._id === userId);
  if (idx === -1) return { error: "User not found" };

  users[idx].passwordHash = await hashPassword(password);
  writeJsonStore(users);

  // Also try Supabase
  if (_supaAvailable) {
    fetch(supabaseUrl(`${TABLE}?id=eq.${userId}`), {
      method: "PATCH",
      headers: supabaseHeaders(),
      body: JSON.stringify({ password_hash: users[idx].passwordHash }),
    }).catch(() => {});
  }

  return {};
}
