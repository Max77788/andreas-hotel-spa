"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { EventItem } from "@/lib/cms/types";
import { useAutoSave } from "@/lib/use-auto-save";

function EventCard({ item, onRemove }: {
  item: EventItem;
  onRemove: (id: string) => void;
}) {
  const [local, setLocal] = useState<EventItem>(item);

  const save = useCallback(async () => {
    const res = await fetch("/api/admin/events", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local),
    });
    if (!res.ok) return false;
    return true;
  }, [local]);

  const status = useAutoSave(local, save);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    if (url) setLocal({ ...local, image_url: url });
  }

  return (
    <div className="bg-white p-6 border-[3px] border-neutral-500 shadow-md shadow-black/10 space-y-4">
      <div className="flex gap-4">
        <input value={local.tag || ""} onChange={e => setLocal({ ...local, tag: e.target.value })} className="w-32 text-lg font-bold uppercase border-[3px] border-neutral-400 px-4 py-3 bg-neutral-50" placeholder="TAG" />
        <input value={local.date_label} onChange={e => setLocal({ ...local, date_label: e.target.value })} className="text-lg font-bold border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" placeholder="Date" />
      </div>
      <input value={local.title} onChange={e => setLocal({ ...local, title: e.target.value })} className="text-2xl font-bold w-full border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" />
      <textarea value={local.description || ""} onChange={e => setLocal({ ...local, description: e.target.value })} rows={3} className="text-lg font-medium w-full border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400" />
      <div className="flex items-center gap-4">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="text-lg font-medium" />
        {local.image_url && <img src={local.image_url} className="w-24 h-16 object-cover rounded border-2 border-neutral-400" />}
        <input value={local.image_url || ""} onChange={e => setLocal({ ...local, image_url: e.target.value })} className="text-lg flex-1 border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400" placeholder="Or paste image URL" />
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => onRemove(local.id)} className="text-lg text-red-600 hover:underline font-bold">Delete</button>
        {status === "saving" && <span className="text-lg text-neutral-500 font-bold">Saving...</span>}
        {status === "saved" && <span className="text-lg text-green-700 font-bold">Saved ✓</span>}
      </div>
    </div>
  );
}

export default function EventsEditor() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/admin/events").then(r => r.json()).then(d => { setItems(d); setLoading(false); }); }, []);

  async function add() {
    const res = await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "New Event", date_label: "TBD", tag: "EVENT", sort_order: items.length, is_published: true }) });
    const saved = await res.json();
    setItems([...items, saved]);
  }

  async function remove(id: string) { if (!confirm("Delete?")) return; await fetch("/api/admin/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setItems(items.filter(i => i.id !== id)); }

  if (loading) return <div className="min-h-screen bg-neutral-100 p-8"><p className="text-xl font-bold">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
            <h1 className="text-4xl font-bold text-neutral-900 mt-1">Events</h1>
            <p className="text-base text-neutral-500 mt-1">Edits auto-save — changes are saved as you type.</p>
          </div>
          <button onClick={add} className="bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-amber-600 transition-colors">+ New</button>
        </div>

        <div className="space-y-5">
          {items.map((item) => (
            <EventCard key={item.id} item={item} onRemove={remove} />
          ))}
        </div>
      </div>
    </div>
  );
}
