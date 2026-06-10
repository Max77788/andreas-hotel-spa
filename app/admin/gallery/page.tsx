"use client";

import { useEffect, useState, useRef } from "react";
import type { GalleryImage } from "@/lib/cms/types";

export default function GalleryEditor() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedId, setSavedId] = useState<string | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => { fetch("/api/admin/gallery").then(r => r.json()).then(d => { setItems(d); setLoading(false); }); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files; if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const { url } = await res.json();
      await fetch("/api/admin/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image_url: url, alt: file.name.split(".")[0], category: "general", sort_order: items.length }) });
    }
    const refreshed = await fetch("/api/admin/gallery").then(r => r.json());
    setItems(refreshed); setUploading(false);
  }

  async function save(id: string) {
    const item = itemsRef.current.find(i => i.id === id); if (!item) return;
    await fetch("/api/admin/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    setSavedId(id); setTimeout(() => setSavedId(null), 1500);
  }

  async function remove(id: string) { if (!confirm("Delete?")) return; await fetch("/api/admin/gallery", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setItems(items.filter(i => i.id !== id)); }

  if (loading) return <div className="min-h-screen bg-neutral-100 p-8"><p className="text-xl font-bold">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
            <h1 className="text-4xl font-bold text-neutral-900 mt-1">Gallery</h1>
          </div>
          <label className="bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-amber-600 transition-colors cursor-pointer">
            {uploading ? "Uploading..." : "+ Upload Photos"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {items.map((item) => (
            <div key={item.id} className="bg-white overflow-hidden border-[3px] border-neutral-300">
              <img src={item.image_url} alt={item.alt || ""} className="w-full aspect-[4/3] object-cover" />
              <div className="p-4 space-y-3">
                <input value={item.alt || ""} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, alt: e.target.value } : i); setItems(u); }} className="text-base font-bold w-full border-[3px] border-neutral-300 px-3 py-2.5 focus:border-amber-500 focus:outline-none placeholder:text-neutral-400" placeholder="Alt text" />
                <input value={item.image_url} onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, image_url: e.target.value } : i); setItems(u); }} className="text-sm font-medium text-neutral-500 w-full truncate border-[3px] border-neutral-300 px-3 py-2.5 focus:border-amber-500 focus:outline-none" />
                <div className="flex items-center justify-between">
                  <button onClick={() => remove(item.id)} className="text-base text-red-600 hover:underline font-bold">Remove</button>
                  <button onClick={() => save(item.id)} className="bg-neutral-900 text-white text-base font-bold px-4 py-2 hover:bg-black transition-colors">
                    {savedId === item.id ? "✓" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
