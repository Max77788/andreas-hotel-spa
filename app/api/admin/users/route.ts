import { NextRequest, NextResponse } from "next/server";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/admin-store";
import { verifySessionToken } from "@/lib/auth";

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
    const users = listUsers();
    return NextResponse.json(users);
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

    const result = updateUser(userId, { name, role });

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

    const result = deleteUser(userId);

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
