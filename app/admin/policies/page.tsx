"use client";

import { useEffect, useState, useRef } from "react";
import type { Policy } from "@/lib/cms/types";

export default function PoliciesEditor() {
  const [items, setItems] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedId, setSavedId] = useState<string | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    fetch("/api/admin/policies").then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  }, []);

  async function save(id: string) {
    const item = itemsRef.current.find(i => i.id === id);
    if (!item) return;
    await fetch("/api/admin/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1500);
  }

  async function add() {
    const item: Policy = { id: "", label: "", detail: "", sort_order: items.length, is_highlighted: false };
    const res = await fetch("/api/admin/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const saved = await res.json();
    setItems([...items, saved]);
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch("/api/admin/policies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems(items.filter(i => i.id !== id));
  }

  if (loading) return <div className="min-h-screen bg-[var(--hotel-cream)] p-8"><p className="font-body text-base">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[var(--hotel-cream)] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="font-body text-sm text-[var(--hotel-charcoal)]/70 hover:text-[var(--hotel-terracotta)] font-semibold">← Dashboard</a>
            <h1 className="font-display text-3xl text-[var(--hotel-charcoal)] font-light mt-1">Policies</h1>
          </div>
          <button onClick={add} className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-sm tracking-[0.2em] uppercase px-6 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors font-semibold">+ Add</button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-5 border-2 border-gray-200">
              <input
                value={item.label}
                onChange={e => { const updated = items.map(i => i.id === item.id ? { ...i, label: e.target.value } : i); setItems(updated); }}
                className="font-body text-sm tracking-[0.15em] uppercase font-bold text-[var(--hotel-charcoal)] w-full mb-3 border-2 border-gray-200 px-3 py-2 focus:border-[var(--hotel-gold)] focus:outline-none"
                placeholder="Label"
              />
              <textarea
                value={item.detail}
                onChange={e => { const updated = items.map(i => i.id === item.id ? { ...i, detail: e.target.value } : i); setItems(updated); }}
                className="font-body text-base text-[var(--hotel-charcoal)]/90 w-full resize-none border-2 border-gray-200 px-3 py-2 focus:border-[var(--hotel-gold)] focus:outline-none"
                rows={2}
                placeholder="Detail"
              />
              <div className="flex items-center justify-between mt-3">
                <button onClick={() => remove(item.id)} className="font-body text-sm text-red-600 hover:underline font-semibold">Delete</button>
                <button onClick={() => save(item.id)} className="bg-[var(--hotel-charcoal)] text-white font-body text-sm px-5 py-2 hover:bg-black transition-colors font-semibold">
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
