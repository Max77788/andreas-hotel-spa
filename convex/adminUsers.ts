import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

// ── Queries ────────────────────────────────────────────

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("adminUsers").collect();
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
  },
});

// ── Actions (password hashing needs Node runtime) ──────

export const createUser = action({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor")),
  },
  handler: async (ctx, args) => {
    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(args.password, salt);

    await ctx.runMutation(internal.adminUsers._insertUser, {
      email: args.email.toLowerCase().trim(),
      name: args.name,
      role: args.role,
      passwordHash,
    });

    return { success: true };
  },
});

export const setPassword = action({
  args: {
    userId: v.id("adminUsers"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(args.password, salt);

    await ctx.runMutation(internal.adminUsers._updatePasswordHash, {
      userId: args.userId,
      passwordHash,
    });

    return { success: true };
  },
});

export const verifyPassword = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ user: any } | { error: string }> => {
    const user = await ctx.runQuery(api.adminUsers.getUserByEmail, {
      email: args.email.toLowerCase().trim(),
    });
    if (!user) return { error: "Invalid email or password" };

    const bcrypt = await import("bcryptjs");
    const valid = await bcrypt.compare(args.password, user.passwordHash);
    if (!valid) return { error: "Invalid email or password" };

    return { user };
  },
});

export const generateResetToken = action({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.adminUsers.getUserByEmail, {
      email: args.email.toLowerCase().trim(),
    });
    if (!user) return { success: true }; // don't reveal if email exists

    const crypto = await import("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour

    await ctx.runMutation(internal.adminUsers._setResetToken, {
      userId: user._id,
      token,
      expiresAt,
    });

    return { success: true, token, user };
  },
});

export const resetPassword = action({
  args: {
    token: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.adminUsers.getUserByResetToken, {
      token: args.token,
    });

    if (!user || !user.resetTokenExpiresAt) {
      return { error: "Invalid or expired reset token" };
    }
    if (Date.now() > user.resetTokenExpiresAt) {
      return { error: "Reset token has expired" };
    }

    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(args.password, salt);

    await ctx.runMutation(internal.adminUsers._updatePasswordHash, {
      userId: user._id,
      passwordHash,
    });
    await ctx.runMutation(internal.adminUsers._clearResetToken, {
      userId: user._id,
    });

    return { success: true };
  },
});

// ── Mutations (no Node deps needed) ────────────────────

export const updateUser = mutation({
  args: {
    userId: v.id("adminUsers"),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("editor"))),
  },
  handler: async (ctx, args) => {
    const { userId, ...fields } = args;
    await ctx.db.patch(userId, fields);
    return { success: true };
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("adminUsers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
    return { success: true };
  },
});

// Needed for the reset-password flow to find user by token
export const getUserByResetToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("resetToken", (q) => q.eq("resetToken", args.token))
      .first();
  },
});

// ── Internal mutations (only callable from actions) ─────

export const _insertUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor")),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
    if (existing) throw new Error("A user with this email already exists");

    await ctx.db.insert("adminUsers", args);
  },
});

export const _updatePasswordHash = mutation({
  args: {
    userId: v.id("adminUsers"),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { passwordHash: args.passwordHash });
  },
});

export const _setResetToken = mutation({
  args: {
    userId: v.id("adminUsers"),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      resetToken: args.token,
      resetTokenExpiresAt: args.expiresAt,
    });
  },
});

export const _clearResetToken = mutation({
  args: { userId: v.id("adminUsers") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      resetToken: undefined,
      resetTokenExpiresAt: undefined,
    });
  },
});
