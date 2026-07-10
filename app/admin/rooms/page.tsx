"use client";

import { useEffect, useState, useCallback } from "react";
import type { Room } from "@/lib/cms/types";
import { useAutoSave } from "@/lib/use-auto-save";

export default function RoomsEditor() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editing, setEditing] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [amenitiesRaw, setAmenitiesRaw] = useState("");

  useEffect(() => { fetchRooms(); }, []);

  async function fetchRooms() { const res = await fetch("/api/admin/rooms"); setRooms(await res.json()); setLoading(false); }

  async function remove(room: Room) {
    if (!confirm(`Delete ${room.name}?`)) return;
    await fetch("/api/admin/rooms", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: room.id, slug: room.slug }) });
    await fetchRooms();
  }

  function newRoom() {
    setEditing({ id: "", slug: "", name: "", badge: "", short_description: "", long_description: "", bed: "", guests: "", sqft: "", price: "", amenities: [], extras: [], image_url: "", gallery_urls: [], sort_order: rooms.length, is_published: true } as Room);
  }

  function updateField(field: keyof Room, value: any) { if (!editing) return; setEditing({ ...editing, [field]: value }); }

  // Sync raw amenities string when editing room changes
  useEffect(() => {
    if (editing) {
      setAmenitiesRaw((editing.amenities || []).join(", "));
    }
  }, [editing?.id]);

  const saveFn = useCallback(async () => {
    if (!editing) return false;
    const res = await fetch("/api/admin/rooms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    if (res.ok) await fetchRooms();
    return res.ok;
  }, [editing]);

  const status = useAutoSave(editing, saveFn, 1000);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: "image_url" | "gallery_urls") {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    if (field === "image_url") updateField("image_url", url);
    else updateField("gallery_urls", [...(editing?.gallery_urls || []), url]);
  }

  if (loading) return <div className="min-h-screen bg-neutral-100 p-8"><p className="text-xl font-bold">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
            <h1 className="text-4xl font-bold text-neutral-900 mt-1">Rooms</h1>
          </div>
          <button onClick={newRoom} className="bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-amber-600 transition-colors">+ New Room</button>
        </div>

        <div className="space-y-4 mb-10">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white p-6 flex items-center justify-between border-[3px] border-neutral-500 shadow-md shadow-black/10">
              <div className="flex items-center gap-5">
                {room.image_url && <img src={room.image_url} alt="" className="w-20 h-14 object-cover rounded border-2 border-neutral-300" />}
                <div>
                  <p className="text-xl font-bold text-neutral-900">{room.name}</p>
                  <p className="text-base font-medium text-neutral-700">{room.slug}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditing(room)} className="text-lg font-bold text-neutral-700 hover:text-amber-600 px-5 py-3 border-[3px] border-neutral-500">Edit</button>
                <button onClick={() => remove(room)} className="text-lg font-bold text-red-600 px-5 py-3 border-[3px] border-neutral-500 hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-12 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl p-10 mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">{editing.id ? `Edit: ${editing.name}` : "New Room"}</h2>

              <div className="grid grid-cols-2 gap-5">
                {[["Name","name"],["Slug","slug"],["Badge","badge"],["Price","price"],["Bed","bed"],["Guests","guests"],["Sq Ft","sqft"]].map(([label, field]) => (
                  <label key={field} className="flex flex-col gap-1.5">
                    <span className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">{label}</span>
                    <input value={(editing as any)[field] || ""} onChange={e => updateField(field as keyof Room, e.target.value)} className="border-[3px] border-neutral-400 px-4 py-3.5 text-lg font-medium focus:border-amber-500 focus:outline-none bg-neutral-50" />
                  </label>
                ))}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">Sort Order</span>
                  <input type="number" value={editing.sort_order} onChange={e => updateField("sort_order", parseInt(e.target.value))} className="border-[3px] border-neutral-400 px-4 py-3.5 text-lg font-medium focus:border-amber-500 focus:outline-none bg-neutral-50" />
                </label>
              </div>

              <label className="flex flex-col gap-1.5 mt-5">
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">Short Description</span>
                <textarea value={editing.short_description || ""} onChange={e => updateField("short_description", e.target.value)} rows={2} className="border-[3px] border-neutral-400 px-4 py-3.5 text-lg font-medium focus:border-amber-500 focus:outline-none bg-neutral-50" />
              </label>

              <label className="flex flex-col gap-1.5 mt-5">
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">Long Description</span>
                <textarea value={editing.long_description || ""} onChange={e => updateField("long_description", e.target.value)} rows={4} className="border-[3px] border-neutral-400 px-4 py-3.5 text-lg font-medium focus:border-amber-500 focus:outline-none bg-neutral-50" />
              </label>

              <label className="flex flex-col gap-1.5 mt-5">
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">Amenities (comma-separated)</span>
                <textarea value={amenitiesRaw} onChange={e => setAmenitiesRaw(e.target.value)} onBlur={() => updateField("amenities", amenitiesRaw.split(",").map(s => s.trim()).filter(Boolean))} rows={2} className="border-[3px] border-neutral-400 px-4 py-3.5 text-lg font-medium focus:border-amber-500 focus:outline-none bg-neutral-50" />
              </label>

              <div className="mt-5 space-y-2">
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">Main Image</span>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "image_url")} className="text-base font-medium" />
                {editing.image_url && <img src={editing.image_url} className="w-40 h-24 object-cover rounded border-2 border-neutral-300" />}
                <input value={editing.image_url || ""} onChange={e => updateField("image_url", e.target.value)} placeholder="Or paste URL" className="border-[3px] border-neutral-400 px-4 py-3.5 text-lg w-full mt-1 focus:border-amber-500 focus:outline-none font-medium bg-neutral-50" />
              </div>

              <div className="mt-5 space-y-2">
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">Gallery Images</span>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "gallery_urls")} className="text-base font-medium" />
                <div className="flex gap-3 flex-wrap">
                  {(editing.gallery_urls || []).map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} className="w-24 h-16 object-cover rounded border-2 border-neutral-300" />
                      <button onClick={() => updateField("gallery_urls", editing.gallery_urls.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-600 text-white text-sm rounded-full flex items-center justify-center font-bold">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-5 mt-10">
                {status === "saving" && <span className="text-lg text-neutral-500 font-bold px-4 py-4">Saving...</span>}
                {status === "saved" && <span className="text-lg text-green-700 font-bold px-4 py-4">Saved ✓</span>}
                <button onClick={() => setEditing(null)} className="text-lg font-bold text-neutral-600 px-6 py-4 border-[3px] border-neutral-400">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
