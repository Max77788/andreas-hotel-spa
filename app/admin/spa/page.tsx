"use client";

import { useEffect, useState, useCallback } from "react";
import type { SpaItem } from "@/lib/cms/types";
import { useAutoSave } from "@/lib/use-auto-save";

const CATEGORY_LABELS: Record<string, string> = {
  package: "Package",
  premium: "Premium Package",
  massage: "Massage",
  facial: "Facial",
  body_treatment: "Body Treatment",
  addon: "Add-On",
};

function SpaCard({ item, onRemove }: { item: SpaItem; onRemove: (id: string) => void }) {
  const [local, setLocal] = useState<SpaItem>(item);

  const save = useCallback(async () => {
    const res = await fetch("/api/admin/spa", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local),
    });
    if (!res.ok) return false;
    return true;
  }, [local]);

  const status = useAutoSave(local, save);

  return (
    <div className="bg-white p-5 border-[3px] border-neutral-500 shadow-md shadow-black/10 space-y-3">
      <div className="flex gap-3 items-start">
        <select
          value={local.category}
          onChange={e => setLocal({ ...local, category: e.target.value as SpaItem["category"] })}
          className="w-40 text-sm font-bold uppercase border-[3px] border-neutral-400 px-3 py-2 bg-neutral-50"
        >
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <input
          value={local.name}
          onChange={e => setLocal({ ...local, name: e.target.value })}
          className="flex-1 text-lg font-bold border-[3px] border-neutral-400 px-4 py-2 focus:border-amber-500 focus:outline-none bg-neutral-50"
          placeholder="Name"
        />
      </div>

      <div className="flex gap-3">
        {(local.category === "package" || local.category === "premium" || local.category === "facial" || local.category === "body_treatment") && (
          <input
            value={local.price || ""}
            onChange={e => setLocal({ ...local, price: e.target.value })}
            className="w-28 text-sm font-bold border-[3px] border-neutral-400 px-3 py-2 bg-neutral-50"
            placeholder="Price"
          />
        )}
        {local.category === "massage" && (
          <div className="flex gap-2">
            <input
              value={local.price_50 || ""}
              onChange={e => setLocal({ ...local, price_50: e.target.value })}
              className="w-28 text-sm font-bold border-[3px] border-neutral-400 px-3 py-2 bg-neutral-50"
              placeholder="50 min price"
            />
            <input
              value={local.price_80 || ""}
              onChange={e => setLocal({ ...local, price_80: e.target.value })}
              className="w-28 text-sm font-bold border-[3px] border-neutral-400 px-3 py-2 bg-neutral-50"
              placeholder="80 min price"
            />
          </div>
        )}
        {local.category === "premium" && (
          <input
            value={local.duration || ""}
            onChange={e => setLocal({ ...local, duration: e.target.value })}
            className="w-28 text-sm font-bold border-[3px] border-neutral-400 px-3 py-2 bg-neutral-50"
            placeholder="Duration"
          />
        )}
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={local.is_published} onChange={e => setLocal({ ...local, is_published: e.target.checked })} />
          Published
        </label>
      </div>

      {(local.category !== "addon") && (
        <textarea
          value={local.description || ""}
          onChange={e => setLocal({ ...local, description: e.target.value })}
          rows={2}
          className="text-sm w-full border-[3px] border-neutral-400 px-4 py-2 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400"
          placeholder="Description"
        />
      )}

      <div className="flex items-center justify-between">
        <button onClick={() => onRemove(local.id)} className="text-sm text-red-600 hover:underline font-bold">Delete</button>
        {status === "saving" && <span className="text-sm text-neutral-500 font-bold">Saving...</span>}
        {status === "saved" && <span className="text-sm text-green-700 font-bold">Saved ✓</span>}
      </div>
    </div>
  );
}

export default function SpaEditor() {
  const [items, setItems] = useState<SpaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/spa").then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  }, []);

  async function add(category: string) {
    const res = await fetch("/api/admin/spa", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Item", category, sort_order: items.length, is_published: true }),
    });
    const saved = await res.json();
    setItems([...items, saved]);
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch("/api/admin/spa", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems(items.filter(i => i.id !== id));
  }

  if (loading) return <div className="min-h-screen bg-neutral-100 p-8"><p className="text-xl font-bold">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
            <h1 className="text-4xl font-bold text-neutral-900 mt-1">Spa Menu</h1>
            <p className="text-base text-neutral-500 mt-1">Edits auto-save as you type.</p>
          </div>
          <div className="flex gap-2">
            {["package", "premium", "massage", "facial", "body_treatment", "addon"].map(cat => (
              <button key={cat} onClick={() => add(cat)} className="bg-amber-500 text-neutral-900 text-xs font-bold tracking-[0.1em] uppercase px-3 py-2 hover:bg-amber-600 transition-colors">
                + {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {items.map((item) => (
            <SpaCard key={item.id} item={item} onRemove={remove} />
          ))}
        </div>
      </div>
    </div>
  );
}
