"use client";

import { useEffect, useState, useRef } from "react";
import type { Offer, OfferInclusion } from "@/lib/cms/types";

export default function OffersEditor() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [inclusions, setInclusions] = useState<OfferInclusion[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"offers" | "inclusions">("offers");
  const [savedId, setSavedId] = useState<string | null>(null);
  const offersRef = useRef(offers);
  const inclusionsRef = useRef(inclusions);
  offersRef.current = offers;
  inclusionsRef.current = inclusions;

  useEffect(() => {
    fetch("/api/admin/offers").then(r => r.json()).then(d => {
      setOffers(d.offers || []);
      setInclusions(d.inclusions || []);
      setLoading(false);
    });
  }, []);

  async function saveOffer(id: string) {
    const item = offersRef.current.find(o => o.id === id);
    if (!item) return;
    await fetch("/api/admin/offers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1500);
  }

  async function saveInclusion(id: string) {
    const item = inclusionsRef.current.find(i => i.id === id);
    if (!item) return;
    await fetch("/api/admin/offers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, type: "inclusion" }),
    });
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1500);
  }

  async function addOffer() {
    const res = await fetch("/api/admin/offers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Offer", category: "one_night", sort_order: offers.length, is_published: true }),
    });
    const saved = await res.json();
    setOffers([...offers, saved]);
  }

  async function addInclusion() {
    const res = await fetch("/api/admin/offers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ icon: "★", label: "New Item", type: "inclusion", sort_order: inclusions.length }),
    });
    const saved = await res.json();
    setInclusions([...inclusions, saved]);
  }

  async function removeOffer(id: string) {
    await fetch("/api/admin/offers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setOffers(offers.filter(o => o.id !== id));
  }

  async function removeInclusion(id: string) {
    await fetch("/api/admin/offers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, type: "inclusion" }) });
    setInclusions(inclusions.filter(i => i.id !== id));
  }

  if (loading) return <div className="min-h-screen bg-[var(--hotel-cream)] p-8"><p className="font-body text-sm">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[var(--hotel-cream)] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <a href="/admin/dashboard" className="font-body text-xs text-[var(--hotel-charcoal)]/50 hover:text-[var(--hotel-terracotta)]">← Dashboard</a>
          <h1 className="font-display text-3xl text-[var(--hotel-charcoal)] font-light mt-1">Offers</h1>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setTab("offers")} className={`font-body text-xs tracking-[0.2em] uppercase px-4 py-2 ${tab === "offers" ? "bg-[var(--hotel-charcoal)] text-white" : "border border-gray-200 text-[var(--hotel-charcoal)]/60"}`}>Packages</button>
          <button onClick={() => setTab("inclusions")} className={`font-body text-xs tracking-[0.2em] uppercase px-4 py-2 ${tab === "inclusions" ? "bg-[var(--hotel-charcoal)] text-white" : "border border-gray-200 text-[var(--hotel-charcoal)]/60"}`}>Inclusions</button>
        </div>

        {tab === "offers" && (
          <>
            <button onClick={addOffer} className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-xs tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors mb-4">+ New Package</button>
            <div className="space-y-3">
              {offers.map((item) => (
                <div key={item.id} className="bg-white p-4 space-y-2">
                  <input value={item.title} onChange={e => { const u = offers.map(o => o.id === item.id ? { ...o, title: e.target.value } : o); setOffers(u); }} className="font-display text-lg w-full border-b border-transparent focus:border-[var(--hotel-gold)] focus:outline-none" />
                  <textarea value={item.description || ""} onChange={e => { const u = offers.map(o => o.id === item.id ? { ...o, description: e.target.value } : o); setOffers(u); }} rows={2} className="text-sm w-full border-b border-transparent focus:border-[var(--hotel-gold)] focus:outline-none" placeholder="Description" />
                  <div className="flex gap-4">
                    <input value={item.price || ""} onChange={e => { const u = offers.map(o => o.id === item.id ? { ...o, price: e.target.value } : o); setOffers(u); }} className="text-sm w-24 border-b border-transparent focus:border-[var(--hotel-gold)] focus:outline-none" placeholder="Price" />
                    <select value={item.category} onChange={e => { const u = offers.map(o => o.id === item.id ? { ...o, category: e.target.value as "one_night" | "two_night" } : o); setOffers(u); }} className="text-sm border border-gray-200 px-2">
                      <option value="one_night">1 Night</option>
                      <option value="two_night">2 Night</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <button onClick={() => removeOffer(item.id)} className="font-body text-[10px] text-red-500 hover:underline">Delete</button>
                    <button onClick={() => saveOffer(item.id)} className="bg-[var(--hotel-charcoal)] text-white font-body text-xs px-4 py-1.5 hover:bg-black transition-colors">
                      {savedId === item.id ? "Saved ✓" : "Save"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "inclusions" && (
          <>
            <button onClick={addInclusion} className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-xs tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors mb-4">+ New Inclusion</button>
            <div className="space-y-2">
              {inclusions.map((item) => (
                <div key={item.id} className="bg-white p-3 flex gap-3 items-center">
                  <input value={item.icon} onChange={e => { const u = inclusions.map(i => i.id === item.id ? { ...i, icon: e.target.value } : i); setInclusions(u); }} className="w-10 text-center border-b border-transparent focus:border-[var(--hotel-gold)] focus:outline-none" />
                  <input value={item.label} onChange={e => { const u = inclusions.map(i => i.id === item.id ? { ...i, label: e.target.value } : i); setInclusions(u); }} className="flex-1 text-sm border-b border-transparent focus:border-[var(--hotel-gold)] focus:outline-none" />
                  <button onClick={() => removeInclusion(item.id)} className="font-body text-[10px] text-red-500 hover:underline">×</button>
                  <button onClick={() => saveInclusion(item.id)} className="bg-[var(--hotel-charcoal)] text-white font-body text-xs px-3 py-1 hover:bg-black transition-colors">
                    {savedId === item.id ? "✓" : "Save"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
