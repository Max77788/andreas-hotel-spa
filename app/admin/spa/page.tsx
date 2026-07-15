"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
        {(local.category === "package" || local.category === "premium") && (
          <input
            value={local.promo_price || ""}
            onChange={e => setLocal({ ...local, promo_price: e.target.value })}
            className="w-32 text-sm font-bold border-[3px] border-amber-400 px-3 py-2 bg-amber-50"
            placeholder="Promo Price"
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
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCat, setNewCat] = useState("massage");
  const [newName, setNewName] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/spa").then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  }, []);

  const filtered = filterCategory ? items.filter(i => i.category === filterCategory) : items;

  async function add() {
    if (!newName.trim()) return;
    const res = await fetch("/api/admin/spa", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), category: newCat, sort_order: items.length, is_published: true }),
    });
    const saved = await res.json();
    setItems([...items, saved]);
    setShowAddForm(false);
    setNewName("");
    setFilterCategory(newCat);
    // Scroll to the new item after render
    setTimeout(() => {
      const el = document.getElementById(`spa-${saved.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
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
          <div className="flex flex-col gap-2 items-end">
            {/* Category filter buttons */}
            <div className="flex gap-1 flex-wrap justify-end">
              <button onClick={() => setFilterCategory(null)}
                className={`text-xs font-bold tracking-[0.1em] uppercase px-2.5 py-1.5 transition-colors ${!filterCategory ? "bg-amber-500 text-neutral-900" : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"}`}
              >All</button>
              {["package", "premium", "massage", "facial", "body_treatment", "addon"].map(cat => (
                <button key={cat} onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                  className={`text-xs font-bold tracking-[0.1em] uppercase px-2.5 py-1.5 transition-colors ${filterCategory === cat ? "bg-amber-500 text-neutral-900" : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"}`}
                >{CATEGORY_LABELS[cat]}</button>
              ))}
            </div>
            {/* Add item button */}
            {!showAddForm ? (
              <button onClick={() => setShowAddForm(true)}
                className="bg-neutral-900 text-white text-sm font-bold px-4 py-2 hover:bg-neutral-700 transition-colors"
              >+ Add Item</button>
            ) : (
              <div className="flex items-center gap-2 bg-white p-2 border-[2px] border-amber-400 shadow-md">
                <select value={newCat} onChange={e => setNewCat(e.target.value)}
                  className="text-xs font-bold border-[2px] border-neutral-300 px-2 py-1.5 bg-neutral-50">
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && add()}
                  className="text-sm border-[2px] border-neutral-300 px-3 py-1.5 w-40 focus:border-amber-400 focus:outline-none"
                  placeholder="Item name" autoFocus />
                <button onClick={add} className="bg-amber-500 text-neutral-900 text-xs font-bold px-3 py-1.5 hover:bg-amber-600">Add</button>
                <button onClick={() => setShowAddForm(false)} className="text-xs text-neutral-500 hover:text-neutral-700 px-2">✕</button>
              </div>
            )}
          </div>
        </div>

        <div ref={listRef} className="space-y-5">
          {filtered.map((item) => (
            <div key={item.id} id={`spa-${item.id}`}>
              <SpaCard item={item} onRemove={remove} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
