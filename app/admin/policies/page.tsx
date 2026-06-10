"use client";

import { useEffect, useState, useRef } from "react";
import type { Policy } from "@/lib/cms/types";

export default function PoliciesEditor() {
  const [items, setItems] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    fetch("/api/admin/policies").then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  }, []);

  async function save(id: string) {
    setApiError(null);
    const item = itemsRef.current.find(i => i.id === id);
    if (!item) return;
    const res = await fetch("/api/admin/policies", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) { const err = await res.json(); setApiError(`${err.error} (${err.code || "unknown"})`); return; }
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1500);
  }

  async function add() {
    const item: Policy = { id: "", label: "", detail: "", sort_order: items.length, is_highlighted: false };
    const res = await fetch("/api/admin/policies", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const saved = await res.json();
    setItems([...items, saved]);
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch("/api/admin/policies", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
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
            <div key={item.id} className="bg-white p-6 border-[3px] border-neutral-300">
              <input
                value={item.label}
                onChange={e => { const updated = items.map(i => i.id === item.id ? { ...i, label: e.target.value } : i); setItems(updated); }}
                className="text-xl font-bold text-neutral-900 w-full mb-3 border-[3px] border-neutral-300 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400"
                placeholder="Label"
              />
              <textarea
                value={item.detail}
                onChange={e => { const updated = items.map(i => i.id === item.id ? { ...i, detail: e.target.value } : i); setItems(updated); }}
                className="text-lg font-medium text-neutral-800 w-full resize-none border-[3px] border-neutral-300 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400"
                rows={3}
                placeholder="Detail"
              />
              <div className="flex items-center justify-between mt-4">
                <button onClick={() => remove(item.id)} className="text-lg text-red-600 hover:underline font-bold">Delete</button>
                <button onClick={() => save(item.id)} className="bg-neutral-900 text-white text-lg font-bold px-6 py-3 hover:bg-black transition-colors">
                  {savedId === item.id ? "Saved ✓" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
