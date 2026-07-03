"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { Offer, OfferInclusion } from "@/lib/cms/types";
import { useAutoSave } from "@/lib/use-auto-save";

function OfferCard({ item, onRemove }: {
  item: Offer;
  onRemove: (id: string) => void;
}) {
  const [local, setLocal] = useState<Offer>(item);

  const save = useCallback(async () => {
    const res = await fetch("/api/admin/offers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local),
    });
    return res.ok;
  }, [local]);

  const status = useAutoSave(local, save);

  return (
    <div className="bg-white p-6 border-[3px] border-neutral-500 shadow-md shadow-black/10 space-y-3">
      <input value={local.title} onChange={e => setLocal({ ...local, title: e.target.value })} className="text-2xl font-bold w-full border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" />
      <textarea value={local.description || ""} onChange={e => setLocal({ ...local, description: e.target.value })} rows={2} className="text-lg font-medium w-full border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 placeholder:text-neutral-400" placeholder="Description" />
      {local.duration && (
        <input value={local.duration} onChange={e => setLocal({ ...local, duration: e.target.value })} className="text-lg font-medium w-full border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" placeholder="Duration info" />
      )}
      <div className="flex gap-4">
        <input value={local.price || ""} onChange={e => setLocal({ ...local, price: e.target.value })} className="text-lg font-bold w-32 border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" placeholder="Price" />
        <select value={local.category} onChange={e => setLocal({ ...local, category: e.target.value as "one_night" | "two_night" })} className="text-lg font-bold border-[3px] border-neutral-400 px-4 py-3">
          <option value="one_night">1 Night</option>
          <option value="two_night">2 Night</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => onRemove(local.id)} className="text-lg text-red-600 hover:underline font-bold">Delete</button>
        {status === "saving" && <span className="text-lg text-neutral-500 font-bold">Saving...</span>}
        {status === "saved" && <span className="text-lg text-green-700 font-bold">Saved ✓</span>}
      </div>
    </div>
  );
}

function InclusionItem({ item, onRemove }: {
  item: OfferInclusion;
  onRemove: (id: string) => void;
}) {
  const [local, setLocal] = useState<OfferInclusion>(item);

  const save = useCallback(async () => {
    const res = await fetch("/api/admin/offers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...local, type: "inclusion" }),
    });
    return res.ok;
  }, [local]);

  const status = useAutoSave(local, save);

  return (
    <div className="bg-white p-5 border-[3px] border-neutral-500 shadow-md shadow-black/10 flex gap-3 items-center">
      <input value={local.icon} onChange={e => setLocal({ ...local, icon: e.target.value })} className="w-16 text-center border-[3px] border-neutral-400 px-3 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50 text-xl font-bold" />
      <input value={local.label} onChange={e => setLocal({ ...local, label: e.target.value })} className="flex-1 text-lg font-bold border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" />
      {local.detail && (
        <input value={local.detail} onChange={e => setLocal({ ...local, detail: e.target.value })} className="flex-1 text-lg font-medium border-[3px] border-neutral-400 px-4 py-3 focus:border-amber-500 focus:outline-none bg-neutral-50" placeholder="Detail" />
      )}
      <button onClick={() => onRemove(local.id)} className="text-2xl text-red-600 hover:underline font-bold">×</button>
      {status === "saving" && <span className="text-base text-neutral-500 font-bold">Saving...</span>}
      {status === "saved" && <span className="text-base text-green-700 font-bold">✓</span>}
    </div>
  );
}

export default function OffersEditor() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [inclusions, setInclusions] = useState<OfferInclusion[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"offers" | "inclusions">("offers");

  useEffect(() => {
    fetch("/api/admin/offers").then(r => r.json()).then(d => {
      setOffers(d.offers || []); setInclusions(d.inclusions || []); setLoading(false);
    });
  }, []);

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
          <p className="text-base text-neutral-500 mt-1">Edits auto-save — changes are saved as you type.</p>
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
                <OfferCard key={item.id} item={item} onRemove={removeOffer} />
              ))}
            </div>
          </>
        )}

        {tab === "inclusions" && (
          <>
            <button onClick={addInclusion} className="bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-amber-600 transition-colors mb-4">+ New Inclusion</button>
            <div className="space-y-3">
              {inclusions.map((item) => (
                <InclusionItem key={item.id} item={item} onRemove={removeInclusion} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
