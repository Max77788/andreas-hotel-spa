import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,
  adminUsers: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor")),
    passwordHash: v.string(),
    resetToken: v.optional(v.string()),
    resetTokenExpiresAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("resetToken", ["resetToken"]),
})
