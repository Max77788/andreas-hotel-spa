"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Shield, Trash2, UserPlus, Pencil, X } from "lucide-react";

interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add/edit modal
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [formEmail, setFormEmail] = useState("");
  const [formName, setFormName] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<"admin" | "editor">("editor");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      setUsers(data);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function openAdd() {
    setEditUser(null);
    setFormEmail("");
    setFormName("");
    setFormPassword("");
    setFormRole("editor");
    setFormError("");
    setShowModal(true);
  }

  function openEdit(user: AdminUser) {
    setEditUser(user);
    setFormEmail(user.email);
    setFormName(user.name);
    setFormPassword("");
    setFormRole(user.role);
    setFormError("");
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    if (editUser) {
      // Editing — update name/role only
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: editUser._id, name: formName, role: formRole }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchUsers();
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to update");
      }
    } else {
      // Creating
      if (!formEmail || !formName || !formPassword) {
        setFormError("All fields are required");
        setFormLoading(false);
        return;
      }
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formEmail,
          name: formName,
          password: formPassword,
          role: formRole,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchUsers();
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to create user");
      }
    }
    setFormLoading(false);
  }

  async function handleDelete(userId: string) {
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      setDeleteTarget(null);
      fetchUsers();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to delete");
      setDeleteTarget(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 p-8 flex items-center justify-center">
        <p className="text-2xl font-bold text-neutral-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900">Users</h1>
            <p className="text-lg text-neutral-600 font-medium mt-1">
              CMS admin accounts
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/admin/dashboard"
              className="text-lg font-bold text-neutral-700 hover:text-amber-600 py-3 px-4 border-[3px] border-neutral-300 hover:border-amber-500 bg-white"
            >
              Dashboard
            </a>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-amber-500 text-neutral-900 text-lg font-bold px-6 py-3 hover:bg-amber-600 transition-colors"
            >
              <UserPlus size={20} />
              Add User
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-lg font-bold mb-5 bg-red-50 p-4 border-[3px] border-red-400">
            {error}
          </p>
        )}

        {/* Users table */}
        <div className="bg-white border-[3px] border-neutral-300 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-100 border-b-[3px] border-neutral-300">
                <th className="text-left px-6 py-4 text-lg font-bold text-neutral-700">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-lg font-bold text-neutral-700">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-lg font-bold text-neutral-700">
                  Role
                </th>
                <th className="text-right px-6 py-4 text-lg font-bold text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-lg font-bold text-neutral-400"
                  >
                    No users yet. Add the first admin.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b-[2px] border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="px-6 py-4 text-lg font-bold text-neutral-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-lg text-neutral-700 font-medium">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-lg font-bold px-3 py-1 ${
                        user.role === "admin"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      <Shield size={16} />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="text-neutral-500 hover:text-amber-600 p-2"
                        title="Edit"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="text-neutral-500 hover:text-red-600 p-2"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-10 w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {editUser ? "Edit User" : "Add User"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave}>
                <label className="block text-lg font-bold text-neutral-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border-[3px] border-neutral-400 px-4 py-4 text-lg text-neutral-900 mb-5 focus:outline-none focus:border-amber-500 font-medium bg-neutral-50"
                  placeholder="Full name"
                />

                <label className="block text-lg font-bold text-neutral-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  disabled={!!editUser}
                  className="w-full border-[3px] border-neutral-400 px-4 py-4 text-lg text-neutral-900 mb-5 focus:outline-none focus:border-amber-500 font-medium bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="email@example.com"
                />

                {!editUser && (
                  <>
                    <label className="block text-lg font-bold text-neutral-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full border-[3px] border-neutral-400 px-4 py-4 text-lg text-neutral-900 mb-5 focus:outline-none focus:border-amber-500 font-medium bg-neutral-50"
                      placeholder="Min 8 characters"
                    />
                  </>
                )}

                <label className="block text-lg font-bold text-neutral-700 mb-2">
                  Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) =>
                    setFormRole(e.target.value as "admin" | "editor")
                  }
                  className="w-full border-[3px] border-neutral-400 px-4 py-4 text-lg text-neutral-900 mb-5 focus:outline-none focus:border-amber-500 font-medium bg-neutral-50"
                >
                  <option value="admin">Admin (full access)</option>
                  <option value="editor">Editor (content only)</option>
                </select>

                {formError && (
                  <p className="text-red-600 text-lg font-bold mb-5">
                    {formError}
                  </p>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border-[3px] border-neutral-400 text-neutral-700 text-lg font-bold py-4 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.1em] uppercase py-4 hover:bg-amber-600 transition-colors disabled:opacity-30"
                  >
                    {formLoading ? "..." : editUser ? "Save" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-10 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Delete User
              </h2>
              <p className="text-lg text-neutral-600 font-medium mb-6">
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.name}</strong> ({deleteTarget.email})?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 border-[3px] border-neutral-400 text-neutral-700 text-lg font-bold py-4 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteTarget._id)}
                  className="flex-1 bg-red-600 text-white text-lg font-bold tracking-[0.1em] uppercase py-4 hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
