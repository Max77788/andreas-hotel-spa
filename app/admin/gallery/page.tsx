"use client";

import { useEffect, useState } from "react";
import type { GalleryImage } from "@/lib/cms/types";

export default function GalleryEditor() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

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

  async function update(item: GalleryImage) {
    await fetch("/api/admin/gallery", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  }

  async function remove(id: string) {
    await fetch("/api/admin/gallery", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems(items.filter(i => i.id !== id));
  }

  if (loading) return <div className="min-h-screen bg-[var(--hotel-cream)] p-8"><p className="font-body text-sm">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[var(--hotel-cream)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="font-body text-xs text-[var(--hotel-charcoal)]/50 hover:text-[var(--hotel-terracotta)]">← Dashboard</a>
            <h1 className="font-display text-3xl text-[var(--hotel-charcoal)] font-light mt-1">Gallery</h1>
          </div>
          <label className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-xs tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors cursor-pointer">
            {uploading ? "Uploading..." : "+ Upload Photos"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white overflow-hidden group">
              <img src={item.image_url} alt={item.alt || ""} className="w-full aspect-[4/3] object-cover" />
              <div className="p-2 space-y-1">
                <input
                  value={item.alt || ""}
                  onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, alt: e.target.value } : i); setItems(u); }}
                  onBlur={() => update(item)}
                  className="text-xs w-full border-b border-transparent focus:border-[var(--hotel-gold)] focus:outline-none"
                  placeholder="Alt text"
                />
                <input
                  value={item.image_url}
                  onChange={e => { const u = items.map(i => i.id === item.id ? { ...i, image_url: e.target.value } : i); setItems(u); }}
                  onBlur={() => update(item)}
                  className="text-[10px] text-gray-400 w-full truncate border-b border-transparent focus:border-[var(--hotel-gold)] focus:outline-none"
                />
                <button onClick={() => remove(item.id)} className="text-[10px] text-red-500 hover:underline">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
