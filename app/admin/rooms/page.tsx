"use client";

import { useEffect, useState } from "react";
import type { Room } from "@/lib/cms/types";

export default function RoomsEditor() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editing, setEditing] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchRooms(); }, []);

  async function fetchRooms() {
    const res = await fetch("/api/admin/rooms");
    const data = await res.json();
    setRooms(data);
    setLoading(false);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    await fetch("/api/admin/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    await fetchRooms();
    setEditing(null);
    setSaving(false);
  }

  async function remove(room: Room) {
    if (!confirm(`Delete ${room.name}?`)) return;
    await fetch("/api/admin/rooms", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: room.id, slug: room.slug }),
    });
    await fetchRooms();
  }

  function newRoom() {
    setEditing({
      id: "",
      slug: "", name: "", badge: "", short_description: "", long_description: "",
      bed: "", guests: "", sqft: "", price: "",
      amenities: [], extras: [], image_url: "", gallery_urls: [],
      sort_order: rooms.length, is_published: true,
    } as Room);
  }

  function updateField(field: keyof Room, value: any) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: "image_url" | "gallery_urls") {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const { url } = await res.json();
    if (field === "image_url") updateField("image_url", url);
    else updateField("gallery_urls", [...(editing?.gallery_urls || []), url]);
  }

  if (loading) return <div className="min-h-screen bg-[var(--hotel-cream)] p-8"><p className="font-body text-base">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[var(--hotel-cream)] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="font-body text-sm text-[var(--hotel-charcoal)]/70 hover:text-[var(--hotel-terracotta)] font-semibold">← Dashboard</a>
            <h1 className="font-display text-3xl text-[var(--hotel-charcoal)] font-light mt-1">Rooms</h1>
          </div>
          <button onClick={newRoom} className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-sm tracking-[0.2em] uppercase px-6 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors font-semibold">
            + New Room
          </button>
        </div>

        {/* Room list */}
        <div className="space-y-3 mb-10">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white p-5 flex items-center justify-between border-2 border-gray-200">
              <div className="flex items-center gap-4">
                {room.image_url && (
                  <img src={room.image_url} alt="" className="w-16 h-12 object-cover rounded" />
                )}
                <div>
                  <p className="font-display text-[var(--hotel-charcoal)] font-light text-lg">{room.name}</p>
                  <p className="font-body text-sm text-[var(--hotel-charcoal)]/60">{room.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(room)} className="font-body text-sm text-[var(--hotel-charcoal)]/80 hover:text-[var(--hotel-terracotta)] px-4 py-2 border-2 border-gray-200 font-semibold">Edit</button>
                <button onClick={() => remove(room)} className="font-body text-sm text-red-600 px-4 py-2 border-2 border-gray-200 hover:bg-red-50 font-semibold">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-12 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl p-8 mb-12">
              <h2 className="font-display text-2xl text-[var(--hotel-charcoal)] font-light mb-6">
                {editing.id ? `Edit: ${editing.name}` : "New Room"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Name", "name"],
                  ["Slug", "slug"],
                  ["Badge", "badge"],
                  ["Price", "price"],
                  ["Bed", "bed"],
                  ["Guests", "guests"],
                  ["Sq Ft", "sqft"],
                ].map(([label, field]) => (
                  <label key={field} className="flex flex-col gap-1">
                    <span className="font-body text-xs tracking-[0.15em] uppercase text-[var(--hotel-charcoal)]/70 font-semibold">{label}</span>
                    <input value={(editing as any)[field] || ""} onChange={e => updateField(field as keyof Room, e.target.value)} className="border-2 border-gray-300 px-3 py-2.5 text-base focus:border-[var(--hotel-gold)] focus:outline-none" />
                  </label>
                ))}
                <label className="flex flex-col gap-1">
                  <span className="font-body text-xs tracking-[0.15em] uppercase text-[var(--hotel-charcoal)]/70 font-semibold">Sort Order</span>
                  <input type="number" value={editing.sort_order} onChange={e => updateField("sort_order", parseInt(e.target.value))} className="border-2 border-gray-300 px-3 py-2.5 text-base focus:border-[var(--hotel-gold)] focus:outline-none" />
                </label>
              </div>

              <label className="flex flex-col gap-1 mt-4">
                <span className="font-body text-xs tracking-[0.15em] uppercase text-[var(--hotel-charcoal)]/70 font-semibold">Short Description</span>
                <textarea value={editing.short_description || ""} onChange={e => updateField("short_description", e.target.value)} rows={2} className="border-2 border-gray-300 px-3 py-2.5 text-base focus:border-[var(--hotel-gold)] focus:outline-none" />
              </label>

              <label className="flex flex-col gap-1 mt-4">
                <span className="font-body text-xs tracking-[0.15em] uppercase text-[var(--hotel-charcoal)]/70 font-semibold">Long Description</span>
                <textarea value={editing.long_description || ""} onChange={e => updateField("long_description", e.target.value)} rows={4} className="border-2 border-gray-300 px-3 py-2.5 text-base focus:border-[var(--hotel-gold)] focus:outline-none" />
              </label>

              <label className="flex flex-col gap-1 mt-4">
                <span className="font-body text-xs tracking-[0.15em] uppercase text-[var(--hotel-charcoal)]/70 font-semibold">Amenities (comma-separated)</span>
                <textarea
                  value={(editing.amenities || []).join(", ")}
                  onChange={e => updateField("amenities", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  rows={2} className="border-2 border-gray-300 px-3 py-2.5 text-base focus:border-[var(--hotel-gold)] focus:outline-none"
                />
              </label>

              <div className="mt-4 space-y-2">
                <span className="font-body text-xs tracking-[0.15em] uppercase text-[var(--hotel-charcoal)]/70 font-semibold">Main Image</span>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "image_url")} className="text-sm" />
                {editing.image_url && <img src={editing.image_url} className="w-32 h-20 object-cover rounded" />}
                <input value={editing.image_url || ""} onChange={e => updateField("image_url", e.target.value)} placeholder="Or paste URL" className="border-2 border-gray-300 px-3 py-2.5 text-base w-full mt-1 focus:border-[var(--hotel-gold)] focus:outline-none" />
              </div>

              <div className="mt-4 space-y-2">
                <span className="font-body text-xs tracking-[0.15em] uppercase text-[var(--hotel-charcoal)]/70 font-semibold">Gallery Images</span>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "gallery_urls")} className="text-sm" />
                <div className="flex gap-2 flex-wrap">
                  {(editing.gallery_urls || []).map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} className="w-20 h-14 object-cover rounded" />
                      <button
                        onClick={() => updateField("gallery_urls", editing.gallery_urls.filter((_, j) => j !== i))}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={save} disabled={saving} className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-sm tracking-[0.2em] uppercase px-8 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors font-semibold">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditing(null)} className="font-body text-sm text-[var(--hotel-charcoal)]/80 px-4 py-3 border-2 border-gray-300 font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
