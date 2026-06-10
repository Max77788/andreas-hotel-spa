"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/cms/types";

export default function SettingsEditor() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/admin/settings").then(r => r.json()).then(d => { setSettings(d); setLoading(false); }); }, []);

  async function save() {
    if (!settings) return;
    await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function update(field: keyof SiteSettings, value: string) { if (!settings) return; setSettings({ ...settings, [field]: value }); }

  if (loading) return <div className="min-h-screen bg-neutral-100 p-8"><p className="text-xl font-bold">Loading...</p></div>;

  const fields: { key: keyof SiteSettings; label: string }[] = [
    { key: "hotel_name", label: "Hotel Name" }, { key: "tagline", label: "Tagline" },
    { key: "address", label: "Address" }, { key: "phone", label: "Phone" },
    { key: "email", label: "Email" }, { key: "booking_url", label: "Booking URL" },
    { key: "hero_video_url", label: "Hero Video URL" },
    { key: "logo_dark_url", label: "Logo URL (Dark)" }, { key: "logo_light_url", label: "Logo URL (Light)" },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
            <h1 className="text-4xl font-bold text-neutral-900 mt-1">Site Settings</h1>
          </div>
          <button onClick={save} className="bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.15em] uppercase px-10 py-4 hover:bg-amber-600 transition-colors">
            {saved ? "✓ Saved" : "Save"}
          </button>
        </div>

        {settings && (
          <div className="space-y-5">
            {fields.map(({ key, label }) => (
              <label key={key} className="flex flex-col gap-2">
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">{label}</span>
                <input
                  value={settings[key] || ""}
                  onChange={e => update(key, e.target.value)}
                  className="border-[3px] border-neutral-400 px-5 py-4 text-lg font-medium focus:border-amber-500 focus:outline-none"
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
