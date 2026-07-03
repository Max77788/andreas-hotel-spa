"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { GalleryImage } from "@/lib/cms/types";
import { useAutoSave } from "@/lib/use-auto-save";

function GalleryCard({ item, onRemove }: {
  item: GalleryImage;
  onRemove: (id: string) => void;
}) {
  const [local, setLocal] = useState<GalleryImage>(item);

  const save = useCallback(async () => {
    const res = await fetch("/api/admin/gallery", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local),
    });
    return res.ok;
  }, [local]);

  const status = useAutoSave(local, save);

  return (
    <div className="bg-white overflow-hidden border-[3px] border-neutral-500 shadow-md shadow-black/10">
      <img src={local.image_url} alt={local.alt || ""} className="w-full aspect-[4/3] object-cover" />
      <div className="p-4 space-y-3">
        <input value={local.alt || ""} onChange={e => setLocal({ ...local, alt: e.target.value })} className="text-base font-bold w-full border-[3px] border-neutral-400 px-3 py-2.5 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400" placeholder="Alt text" />
        <input value={local.image_url} onChange={e => setLocal({ ...local, image_url: e.target.value })} className="text-sm font-medium text-neutral-500 w-full truncate border-[3px] border-neutral-400 px-3 py-2.5 focus:border-amber-500 focus:outline-none bg-neutral-50" />
        <div className="flex items-center justify-between">
          <button onClick={() => onRemove(local.id)} className="text-base text-red-600 hover:underline font-bold">Remove</button>
          {status === "saving" && <span className="text-base text-neutral-500 font-bold">Saving...</span>}
          {status === "saved" && <span className="text-base text-green-700 font-bold">Saved ✓</span>}
        </div>
      </div>
    </div>
  );
}

export default function GalleryEditor() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

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

  async function remove(id: string) { if (!confirm("Delete?")) return; await fetch("/api/admin/gallery", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setItems(items.filter(i => i.id !== id)); }

  if (loading) return <div className="min-h-screen bg-neutral-100 p-8"><p className="text-xl font-bold">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
            <h1 className="text-4xl font-bold text-neutral-900 mt-1">Gallery</h1>
            <p className="text-base text-neutral-500 mt-1">Edits auto-save — changes are saved as you type.</p>
          </div>
          <label className="bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-amber-600 transition-colors cursor-pointer">
            {uploading ? "Uploading..." : "+ Upload Photos"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {items.map((item) => (
            <GalleryCard key={item.id} item={item} onRemove={remove} />
          ))}
        </div>
      </div>
    </div>
  );
}
