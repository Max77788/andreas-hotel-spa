"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { Policy } from "@/lib/cms/types";
import { useAutoSave } from "@/lib/use-auto-save";

function PolicyCard({ item, onUpdate, onRemove }: {
  item: Policy;
  onUpdate: (id: string, patch: Partial<Policy>) => void;
  onRemove: (id: string) => void;
}) {
  const [local, setLocal] = useState<Policy>(item);
  const csId = item.id || "new";

  const save = useCallback(async () => {
    const res = await fetch("/api/admin/policies", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error("Save failed:", err);
      return false;
    }
    if (!item.id) {
      // New item — update parent with the server-assigned id
      const saved = await res.json();
      if (saved?.id) onUpdate(saved.id, { id: saved.id });
    }
    return true;
  }, [local, item.id, onUpdate]);

  const status = useAutoSave(local, save);

  return (
    <div className="bg-white p-6 border-[3px] border-neutral-500 shadow-md shadow-black/10">
      <input
        value={local.label}
        onChange={e => setLocal({ ...local, label: e.target.value })}
        className="text-xl font-bold text-neutral-900 w-full mb-3 border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400"
        placeholder="Label"
      />
      <textarea
        value={local.detail}
        onChange={e => setLocal({ ...local, detail: e.target.value })}
        className="text-lg font-medium text-neutral-800 w-full resize-none border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400"
        rows={3}
        placeholder="Detail"
      />
      <div className="flex items-center justify-between mt-4">
        <button onClick={() => onRemove(local.id)} className="text-lg text-red-600 hover:underline font-bold">Delete</button>
        {status === "saving" && <span className="text-lg text-neutral-500 font-bold">Saving...</span>}
        {status === "saved" && <span className="text-lg text-green-700 font-bold">Saved ✓</span>}
      </div>
    </div>
  );
}

export default function PoliciesEditor() {
  const [items, setItems] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    fetch("/api/admin/policies").then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  }, []);

  const handleUpdate = useCallback((id: string, patch: Partial<Policy>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  }, []);

  async function add() {
    setApiError(null);
    const item: Policy = { id: "", label: "", detail: "", sort_order: items.length, is_highlighted: false };
    const res = await fetch("/api/admin/policies", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) { setApiError("Failed to add"); return; }
    const saved = await res.json();
    setItems([...items, saved]);
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const res = await fetch("/api/admin/policies", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) { setApiError("Failed to delete"); return; }
    setItems(items.filter(i => i.id !== id));
  }

  if (loading) return <div className="min-h-screen bg-neutral-100 p-8"><p className="text-xl font-bold">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
            <h1 className="text-4xl font-bold text-neutral-900 mt-1">Policies</h1>
            <p className="text-base text-neutral-500 mt-1">Edits auto-save — changes are saved as you type.</p>
          </div>
          <button onClick={add} className="bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-amber-600 transition-colors">+ Add</button>
        </div>

        {apiError && (
          <div className="bg-red-100 border-[3px] border-red-500 text-red-800 px-6 py-4 mb-5 text-lg font-bold">
            Error: {apiError}
          </div>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <PolicyCard key={item.id} item={item} onUpdate={handleUpdate} onRemove={remove} />
          ))}
        </div>
      </div>
    </div>
  );
}
