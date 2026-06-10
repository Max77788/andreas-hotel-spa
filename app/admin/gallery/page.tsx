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

  useEffect(() => {
    fetch("/api/admin/gallery").then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const { url } = await res.json();
      const body = { image_url: url, alt: file.name.split(".")[0], category: "general", sort_order: items.length };
      await fetch("/api/admin/gallery", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    const refreshed = await fetch("/api/admin/gallery").then(r => r.json());
    setItems(refreshed);
    setUploading(false);
  }

  async function save(id: string) {
    const item = itemsRef.current.find(i => i.id === id);
    if (!item) return;
    await fetch("/api/admin/gallery", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1500);
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch("/api/admin/gallery", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems(items.filter(i => i.id !== id));
  }

  if (loading) return <div className="min-h-screen bg-[var(--hotel-cream)] p-8"><p className="font-body text-base">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[var(--hotel-cream)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="font-body text-sm text-[var(--hotel-charcoal)]/70 hover:text-[var(--hotel-terracotta)] font-semibold">← Dashboard</a>
            <h1 className="font-display text-3xl text-[var(--hotel-charcoal)] font-light mt-1">Gallery</h1>
          </div>
          <label className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-sm tracking-[0.2em] uppercase px-6 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors cursor-pointer font-semibold">
            {uploading ? "Uploading..." : "+ Upload Photos"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white overflow-hidden group border-2 border-gray-200">
              <img src={item.image_url} alt={item.alt || ""} className="w-full aspect-[4/3] object-cover" />
              <div className="p-3 space-y-2">
                <input
                  value={item.alt || ""}
                  onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, alt: e.target.value } : i); setItems(u); }}
                  className="text-sm w-full border-2 border-gray-200 px-2 py-1.5 focus:border-[var(--hotel-gold)] focus:outline-none"
                  placeholder="Alt text"
                />
                <input
                  value={item.image_url}
                  onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, image_url: e.target.value } : i); setItems(u); }}
                  className="text-xs text-gray-500 w-full truncate border-2 border-gray-200 px-2 py-1.5 focus:border-[var(--hotel-gold)] focus:outline-none"
                />
                <div className="flex items-center justify-between">
                  <button onClick={() => remove(item.id)} className="text-xs text-red-600 hover:underline font-semibold">Remove</button>
                  <button onClick={() => save(item.id)} className="bg-[var(--hotel-charcoal)] text-white font-body text-xs px-3 py-1.5 hover:bg-black transition-colors font-semibold">
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
