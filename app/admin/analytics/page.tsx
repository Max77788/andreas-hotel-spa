"use client";

import { useEffect, useState } from "react";

type Analytics = { days: number; total: number; byEvent: Record<string, number>; topPages: [string, number][]; recent: { event_name: string; page_path: string; created_at: string }[] };

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/analytics?days=30").then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || "Unable to load analytics"); return d; }).then(setData).catch((e) => setError(e.message)); }, []);
  return <div className="min-h-screen bg-neutral-100 p-8"><div className="max-w-5xl mx-auto">
    <a href="/admin/dashboard" className="text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
    <div className="flex items-end justify-between mt-2 mb-8"><div><h1 className="text-4xl font-bold text-neutral-900">Analytics</h1><p className="text-lg text-neutral-600 font-medium">Anonymous website activity from the last 30 days</p></div><span className="text-sm text-neutral-500">No visitor identity stored</span></div>
    {error && <div className="bg-red-100 border-2 border-red-400 p-4 mb-5 font-bold">{error}</div>}
    {!data ? <p className="text-xl font-bold">Loading...</p> : <><div className="grid md:grid-cols-4 gap-4 mb-8">{[["Total events", data.total], ["Booking clicks", data.byEvent.booking_click || 0], ["Chat starts", data.byEvent.chat_started || 0], ["Page views", data.byEvent.page_view || 0]].map(([label, value]) => <div key={String(label)} className="bg-white border-[3px] border-neutral-300 p-6"><p className="text-sm uppercase tracking-widest text-neutral-500 font-bold">{label}</p><p className="text-4xl font-bold mt-2">{value}</p></div>)}</div>
    <div className="grid md:grid-cols-2 gap-5"><section className="bg-white border-[3px] border-neutral-300 p-6"><h2 className="text-2xl font-bold mb-4">Top pages</h2>{data.topPages.length ? data.topPages.map(([page, count]) => <div key={page} className="flex justify-between border-b border-neutral-200 py-3 font-medium"><span>{page}</span><strong>{count}</strong></div>) : <p className="text-neutral-500">No events recorded yet.</p>}</section><section className="bg-white border-[3px] border-neutral-300 p-6"><h2 className="text-2xl font-bold mb-4">Event mix</h2>{Object.entries(data.byEvent).map(([event, count]) => <div key={event} className="flex justify-between border-b border-neutral-200 py-3 font-medium"><span>{event.replaceAll("_", " ")}</span><strong>{count}</strong></div>)}</section></div></>}
  </div></div>;
}
