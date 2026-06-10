"use client";

import { useEffect, useState, useRef } from "react";
import type { Offer, OfferInclusion } from "@/lib/cms/types";

export default function OffersEditor() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [inclusions, setInclusions] = useState<OfferInclusion[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"offers" | "inclusions">("offers");
  const [savedId, setSavedId] = useState<string | null>(null);
  const offersRef = useRef(offers); const inclusionsRef = useRef(inclusions);
  offersRef.current = offers; inclusionsRef.current = inclusions;

  useEffect(() => {
    fetch("/api/admin/offers").then(r => r.json()).then(d => {
      setOffers(d.offers || []); setInclusions(d.inclusions || []); setLoading(false);
    });
  }, []);

  async function saveOffer(id: string) {
    const item = offersRef.current.find(o => o.id === id);
    if (!item) return;
    await fetch("/api/admin/offers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    setSavedId(id); setTimeout(() => setSavedId(null), 1500);
  }

  async function saveInclusion(id: string) {
    const item = inclusionsRef.current.find(i => i.id === id);
    if (!item) return;
    await fetch("/api/admin/offers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...item, type: "inclusion" }) });
    setSavedId(id); setTimeout(() => setSavedId(null), 1500);
  }

  async function addOffer() {
    const res = await fetch("/api/admin/offers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "New Offer", category: "one_night", sort_order: offers.length, is_published: true }) });
    setOffers([...offers, await res.json()]);
  }

  async function addInclusion() {
    const res = await fetch("/api/admin/offers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ icon: "★", label: "New Item", type: "inclusion", sort_order: inclusions.length }) });
    setInclusions([...inclusions, await res.json()]);
  }

  async function removeOffer(id: string) { if (!confirm("Delete?")) return; await fetch("/api/admin/offers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setOffers(offers.filter(o => o.id !== id)); }
  async function removeInclusion(id: string) { if (!confirm("Delete?")) return; await fetch("/api/admin/offers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, type: "inclusion" }) }); setInclusions(inclusions.filter(i => i.id !== id)); }

  if (loading) return <div className="min-h-screen bg-neutral-100 p-8"><p className="text-xl font-bold">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <a href="/admin/dashboard" className="text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
          <h1 className="text-4xl font-bold text-neutral-900 mt-1">Offers</h1>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setTab("offers")} className={`text-lg font-bold tracking-[0.1em] uppercase px-6 py-4 ${tab === "offers" ? "bg-neutral-900 text-white" : "border-[3px] border-neutral-400 text-neutral-700"}`}>Packages</button>
          <button onClick={() => setTab("inclusions")} className={`text-lg font-bold tracking-[0.1em] uppercase px-6 py-4 ${tab === "inclusions" ? "bg-neutral-900 text-white" : "border-[3px] border-neutral-400 text-neutral-700"}`}>Inclusions</button>
        </div>

        {tab === "offers" && (
          <>
            <button onClick={addOffer} className="bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-amber-600 transition-colors mb-4">+ New Package</button>
            <div className="space-y-4">
              {offers.map((item) => (
                <div key={item.id} className="bg-white p-6 border-[3px] border-neutral-300 space-y-3">
                  <input value={item.title} onChange={e => { const u = offers.map(o => o.id === item.id ? { ...o, title: e.target.value } : o); setOffers(u); }} className="text-2xl font-bold w-full border-[3px] border-neutral-300 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" />
                  <textarea value={item.description || ""} onChange={e => { const u = offers.map(o => o.id === item.id ? { ...o, description: e.target.value } : o); setOffers(u); }} rows={2} className="text-lg font-medium w-full border-[3px] border-neutral-300 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400" placeholder="Description" />
                  <div className="flex gap-4">
                    <input value={item.price || ""} onChange={e => { const u = offers.map(o => o.id === item.id ? { ...o, price: e.target.value } : o); setOffers(u); }} className="text-lg font-bold w-32 border-[3px] border-neutral-300 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" placeholder="Price" />
                    <select value={item.category} onChange={e => { const u = offers.map(o => o.id === item.id ? { ...o, category: e.target.value as "one_night" | "two_night" } : o); setOffers(u); }} className="text-lg font-bold border-[3px] border-neutral-300 px-4 py-3">
                      <option value="one_night">1 Night</option>
                      <option value="two_night">2 Night</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <button onClick={() => removeOffer(item.id)} className="text-lg text-red-600 hover:underline font-bold">Delete</button>
                    <button onClick={() => saveOffer(item.id)} className="bg-neutral-900 text-white text-lg font-bold px-6 py-3 hover:bg-black transition-colors">
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
            <button onClick={addInclusion} className="bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-amber-600 transition-colors mb-4">+ New Inclusion</button>
            <div className="space-y-3">
              {inclusions.map((item) => (
                <div key={item.id} className="bg-white p-5 border-[3px] border-neutral-300 flex gap-3 items-center">
                  <input value={item.icon} onChange={e => { const u = inclusions.map(i => i.id === item.id ? { ...i, icon: e.target.value } : i); setInclusions(u); }} className="w-16 text-center border-[3px] border-neutral-300 px-3 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 text-xl font-bold" />
                  <input value={item.label} onChange={e => { const u = inclusions.map(i => i.id === item.id ? { ...i, label: e.target.value } : i); setInclusions(u); }} className="flex-1 text-lg font-bold border-[3px] border-neutral-300 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" />
                  <button onClick={() => removeInclusion(item.id)} className="text-2xl text-red-600 hover:underline font-bold">×</button>
                  <button onClick={() => saveInclusion(item.id)} className="bg-neutral-900 text-white text-lg font-bold px-5 py-3 hover:bg-black transition-colors">
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
