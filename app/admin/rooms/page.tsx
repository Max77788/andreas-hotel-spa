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

  if (loading) return <div className="min-h-screen bg-[var(--hotel-cream)] p-8"><p className="font-body text-sm">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[var(--hotel-cream)] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="font-body text-xs text-[var(--hotel-charcoal)]/50 hover:text-[var(--hotel-terracotta)]">← Dashboard</a>
            <h1 className="font-display text-3xl text-[var(--hotel-charcoal)] font-light mt-1">Rooms</h1>
          </div>
          <button onClick={newRoom} className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-xs tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors">
            + New Room
          </button>
        </div>

        {/* Room list */}
        <div className="space-y-3 mb-10">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {room.image_url && (
                  <img src={room.image_url} alt="" className="w-16 h-12 object-cover rounded" />
                )}
                <div>
                  <p className="font-display text-[var(--hotel-charcoal)] font-light">{room.name}</p>
                  <p className="font-body text-[10px] text-[var(--hotel-charcoal)]/50">{room.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(room)} className="font-body text-xs text-[var(--hotel-charcoal)]/60 hover:text-[var(--hotel-terracota)] px-3 py-1 border border-gray-200">Edit</button>
                <button onClick={() => remove(room)} className="font-body text-xs text-red-500 px-3 py-1 border border-gray-200 hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-12 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl p-8 mb-12">
              <h2 className="font-display text-2xl text-[var(--hotel-charcoal)] font-light mb-6">
                {editing.id ? `Edit: ${editing.name}` : "New Room"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Name</span>
                  <input value={editing.name} onChange={e => updateField("name", e.target.value)} className="border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Slug</span>
                  <input value={editing.slug} onChange={e => updateField("slug", e.target.value)} className="border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Badge</span>
                  <input value={editing.badge || ""} onChange={e => updateField("badge", e.target.value)} className="border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Price</span>
                  <input value={editing.price || ""} onChange={e => updateField("price", e.target.value)} className="border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Bed</span>
                  <input value={editing.bed || ""} onChange={e => updateField("bed", e.target.value)} className="border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Guests</span>
                  <input value={editing.guests || ""} onChange={e => updateField("guests", e.target.value)} className="border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Sq Ft</span>
                  <input value={editing.sqft || ""} onChange={e => updateField("sqft", e.target.value)} className="border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Sort Order</span>
                  <input type="number" value={editing.sort_order} onChange={e => updateField("sort_order", parseInt(e.target.value))} className="border border-gray-200 px-3 py-2 text-sm" />
                </label>
              </div>

              <label className="flex flex-col gap-1 mt-4">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Short Description</span>
                <textarea value={editing.short_description || ""} onChange={e => updateField("short_description", e.target.value)} rows={2} className="border border-gray-200 px-3 py-2 text-sm" />
              </label>

              <label className="flex flex-col gap-1 mt-4">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Long Description</span>
                <textarea value={editing.long_description || ""} onChange={e => updateField("long_description", e.target.value)} rows={4} className="border border-gray-200 px-3 py-2 text-sm" />
              </label>

              <label className="flex flex-col gap-1 mt-4">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Amenities (comma-separated)</span>
                <textarea
                  value={(editing.amenities || []).join(", ")}
                  onChange={e => updateField("amenities", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  rows={2} className="border border-gray-200 px-3 py-2 text-sm"
                />
              </label>

              <div className="mt-4 space-y-2">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Main Image</span>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "image_url")} className="text-sm" />
                {editing.image_url && <img src={editing.image_url} className="w-32 h-20 object-cover rounded" />}
                <input value={editing.image_url || ""} onChange={e => updateField("image_url", e.target.value)} placeholder="Or paste URL" className="border border-gray-200 px-3 py-2 text-sm w-full mt-1" />
              </div>

              <div className="mt-4 space-y-2">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">Gallery Images</span>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "gallery_urls")} className="text-sm" />
                <div className="flex gap-2 flex-wrap">
                  {(editing.gallery_urls || []).map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} className="w-20 h-14 object-cover rounded" />
                      <button
                        onClick={() => updateField("gallery_urls", editing.gallery_urls.filter((_, j) => j !== i))}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center"
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={save} disabled={saving} className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-xs tracking-[0.2em] uppercase px-8 py-2.5 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditing(null)} className="font-body text-xs text-[var(--hotel-charcoal)]/50 px-4 py-2 border border-gray-200">
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
