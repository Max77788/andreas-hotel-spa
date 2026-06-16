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

// ── Store path ───────────────────────────────────────

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(STORE_DIR, "admin-users.json");

function ensureDir() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
}

function readStore(): AdminUser[] {
  ensureDir();
  if (!fs.existsSync(STORE_PATH)) return [];
  const raw = fs.readFileSync(STORE_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeStore(users: AdminUser[]) {
  ensureDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(users, null, 2));
}

// ── Crypto helpers ───────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(password, await bcrypt.genSalt(12));
}

async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hash);
}

// ── Public API ───────────────────────────────────────

export async function findByEmail(
  email: string
): Promise<AdminUser | null> {
  const users = readStore();
  return users.find((u) => u.email === email.toLowerCase().trim()) || null;
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
  const users = readStore();
  // Strip sensitive fields
  return users.map(({ passwordHash, resetToken, resetTokenExpiresAt, ...rest }) => rest as AdminUser);
}

export async function createUser(args: {
  email: string;
  name: string;
  password: string;
  role: "admin" | "editor";
}): Promise<{ userId: string; error?: string }> {
  const email = args.email.toLowerCase().trim();
  const users = readStore();

  if (users.find((u) => u.email === email)) {
    return { userId: "", error: "A user with this email already exists" };
  }

  const passwordHash = await hashPassword(args.password);
  const user: AdminUser = {
    _id: randomUUID(),
    email,
    name: args.name,
    role: args.role,
    passwordHash,
  };

  users.push(user);
  writeStore(users);
  return { userId: user._id };
}

export function updateUser(
  userId: string,
  updates: { name?: string; role?: "admin" | "editor" }
): { error?: string } {
  const users = readStore();
  const idx = users.findIndex((u) => u._id === userId);
  if (idx === -1) return { error: "User not found" };

  if (updates.name !== undefined) users[idx].name = updates.name;
  if (updates.role !== undefined) users[idx].role = updates.role;
  writeStore(users);
  return {};
}

export function deleteUser(userId: string): { error?: string } {
  const users = readStore();
  const idx = users.findIndex((u) => u._id === userId);
  if (idx === -1) return { error: "User not found" };
  users.splice(idx, 1);
  writeStore(users);
  return {};
}

export async function generateResetToken(
  email: string
): Promise<{ token: string; user: AdminUser } | null> {
  const users = readStore();
  const idx = users.findIndex((u) => u.email === email.toLowerCase().trim());
  if (idx === -1) return null;

  const crypto = await import("crypto");
  const token = crypto.randomBytes(32).toString("hex");
  users[idx].resetToken = token;
  users[idx].resetTokenExpiresAt = Date.now() + 3600 * 1000; // 1 hour
  writeStore(users);

  return { token, user: users[idx] };
}

export async function resetPassword(
  token: string,
  password: string
): Promise<{ error?: string }> {
  const users = readStore();
  const idx = users.findIndex(
    (u) =>
      u.resetToken === token &&
      u.resetTokenExpiresAt &&
      u.resetTokenExpiresAt > Date.now()
  );

  if (idx === -1) return { error: "Invalid or expired reset token" };

  users[idx].passwordHash = await hashPassword(password);
  delete users[idx].resetToken;
  delete users[idx].resetTokenExpiresAt;
  writeStore(users);
  return {};
}

export async function setPassword(
  userId: string,
  password: string
): Promise<{ error?: string }> {
  const users = readStore();
  const idx = users.findIndex((u) => u._id === userId);
  if (idx === -1) return { error: "User not found" };

  users[idx].passwordHash = await hashPassword(password);
  writeStore(users);
  return {};
}
