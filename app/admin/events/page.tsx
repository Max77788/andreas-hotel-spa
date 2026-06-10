"use client";

import { useEffect, useState, useRef } from "react";
import type { EventItem } from "@/lib/cms/types";

export default function EventsEditor() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedId, setSavedId] = useState<string | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    fetch("/api/admin/events").then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  }, []);

  async function save(id: string) {
    const item = itemsRef.current.find(i => i.id === id);
    if (!item) return;
    await fetch("/api/admin/events", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1500);
  }

  async function add() {
    const res = await fetch("/api/admin/events", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Event", date_label: "TBD", tag: "EVENT", sort_order: items.length, is_published: true }),
    });
    setItems([...items, await res.json()]);
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch("/api/admin/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems(items.filter(i => i.id !== id));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, itemId: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    setItems(items.map(i => i.id === itemId ? { ...i, image_url: url } : i));
  }

  if (loading) return <div className="min-h-screen bg-[var(--hotel-cream)] p-8"><p className="font-body text-base">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[var(--hotel-cream)] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="font-body text-sm text-[var(--hotel-charcoal)]/70 hover:text-[var(--hotel-terracotta)] font-semibold">← Dashboard</a>
            <h1 className="font-display text-3xl text-[var(--hotel-charcoal)] font-light mt-1">Events</h1>
          </div>
          <button onClick={add} className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-sm tracking-[0.2em] uppercase px-6 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors font-semibold">+ New</button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-5 border-2 border-gray-200 space-y-3">
              <div className="flex gap-3">
                <input value={item.tag || ""} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, tag: e.target.value } : i); setItems(u); }} className="w-28 text-sm font-bold tracking-wider uppercase border-2 border-gray-200 px-3 py-2 bg-[var(--hotel-gold)]/20" placeholder="TAG" />
                <input value={item.date_label} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, date_label: e.target.value } : i); setItems(u); }} className="text-sm text-[var(--hotel-charcoal)]/70 border-2 border-gray-200 px-3 py-2 focus:border-[var(--hotel-gold)] focus:outline-none" placeholder="Date" />
              </div>
              <input value={item.title} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, title: e.target.value } : i); setItems(u); }} className="font-display text-xl w-full border-2 border-gray-200 px-3 py-2 focus:border-[var(--hotel-gold)] focus:outline-none font-semibold" />
              <textarea value={item.description || ""} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i); setItems(u); }} rows={2} className="text-base w-full border-2 border-gray-200 px-3 py-2 focus:border-[var(--hotel-gold)] focus:outline-none" />
              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, item.id)} className="text-sm" />
                {item.image_url && <img src={item.image_url} className="w-20 h-14 object-cover rounded" />}
                <input value={item.image_url || ""} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, image_url: e.target.value } : i); setItems(u); }} className="text-sm flex-1 border-2 border-gray-200 px-3 py-2 focus:border-[var(--hotel-gold)] focus:outline-none" placeholder="Or paste image URL" />
              </div>
              <div className="flex items-center justify-between">
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
