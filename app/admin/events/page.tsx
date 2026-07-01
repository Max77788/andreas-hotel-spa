"use client";

import { useEffect, useState, useRef } from "react";
import type { EventItem } from "@/lib/cms/types";

export default function EventsEditor() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedId, setSavedId] = useState<string | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => { fetch("/api/admin/events").then(r => r.json()).then(d => { setItems(d); setLoading(false); }); }, []);

  async function save(id: string) {
    const item = itemsRef.current.find(i => i.id === id);
    if (!item) return;
    await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    setSavedId(id); setTimeout(() => setSavedId(null), 1500);
  }

  async function add() {
    const res = await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "New Event", date_label: "TBD", tag: "EVENT", sort_order: items.length, is_published: true }) });
    setItems([...items, await res.json()]);
  }

  async function remove(id: string) { if (!confirm("Delete?")) return; await fetch("/api/admin/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setItems(items.filter(i => i.id !== id)); }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, itemId: string) {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    setItems(items.map(i => i.id === itemId ? { ...i, image_url: url } : i));
  }

  if (loading) return <div className="min-h-screen bg-neutral-100 p-8"><p className="text-xl font-bold">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
            <h1 className="text-4xl font-bold text-neutral-900 mt-1">Events</h1>
          </div>
          <button onClick={add} className="bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-amber-600 transition-colors">+ New</button>
        </div>

        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 border-[3px] border-neutral-500 shadow-md shadow-black/10 space-y-4">
              <div className="flex gap-4">
                <input value={item.tag || ""} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, tag: e.target.value } : i); setItems(u); }} className="w-32 text-lg font-bold uppercase border-[3px] border-neutral-400 px-4 py-3 bg-neutral-50" placeholder="TAG" />
                <input value={item.date_label} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, date_label: e.target.value } : i); setItems(u); }} className="text-lg font-bold border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" placeholder="Date" />
              </div>
              <input value={item.title} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, title: e.target.value } : i); setItems(u); }} className="text-2xl font-bold w-full border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" />
              <textarea value={item.description || ""} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i); setItems(u); }} rows={3} className="text-lg font-medium w-full border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400" />
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, item.id)} className="text-lg font-medium" />
                {item.image_url && <img src={item.image_url} className="w-24 h-16 object-cover rounded border-2 border-neutral-400" />}
                <input value={item.image_url || ""} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, image_url: e.target.value } : i); setItems(u); }} className="text-lg flex-1 border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400" placeholder="Or paste image URL" />
              </div>
              <div className="flex items-center justify-between">
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
