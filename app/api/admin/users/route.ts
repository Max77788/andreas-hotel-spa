import { NextRequest, NextResponse } from "next/server";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/admin-store";
import { verifySessionToken } from "@/lib/auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SCHEMA = "andreas_website";

function supaHeaders() {
  return {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    "Accept-Profile": SCHEMA,
  };
}

// Auth helper — rejects non-admins
async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session || session.role !== "admin") return null;
  return session;
}

// GET /api/admin/users — list all users
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Query Supabase first (persistent across serverless instances)
    if (SUPABASE_SERVICE_KEY) {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/admin_users?select=id,email,name,role&order=name`,
          { headers: supaHeaders(), signal: AbortSignal.timeout(5000) }
        );
        if (res.ok) {
          const rows = await res.json();
          return NextResponse.json(
            rows.map((r: any) => ({ _id: r.id, email: r.email, name: r.name, role: r.role }))
          );
        }
      } catch (e) {
        console.warn("Supabase list query failed, falling back to local store:", e);
      }
    }

    // Fallback: local JSON store
    const local = await listUsers();
    return NextResponse.json(
      local.map(({ passwordHash, resetToken, resetTokenExpiresAt, ...rest }) => rest)
    );
  } catch (err) {
    console.error("List users error:", err);
    return NextResponse.json(
      { error: "Failed to list users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users — create new user (admin only)
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, name, password, role } = await req.json();
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: "Email, name, password, and role are required" },
        { status: 400 }
      );
    }

    const result = await createUser({ email, name, password, role });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({ success: true, userId: result.userId }, { status: 201 });
  } catch (err: any) {
    console.error("Create user error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users — update user (admin only)
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, name, role } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const result = await updateUser(userId, { name, role });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Update user error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users — delete user (admin only)
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (userId === admin.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    const result = await deleteUser(userId);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete user error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
