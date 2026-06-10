"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/cms/types";

export default function SettingsEditor() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.json()).then(d => { setSettings(d); setLoading(false); });
  }, []);

  async function save() {
    if (!settings) return;
    await fetch("/api/admin/settings", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function update(field: keyof SiteSettings, value: string) {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  }

  if (loading) return <div className="min-h-screen bg-[var(--hotel-cream)] p-8"><p className="font-body text-sm">Loading...</p></div>;

  const fields: { key: keyof SiteSettings; label: string }[] = [
    { key: "hotel_name", label: "Hotel Name" },
    { key: "tagline", label: "Tagline" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "booking_url", label: "Booking URL" },
    { key: "hero_video_url", label: "Hero Video URL" },
    { key: "logo_dark_url", label: "Logo URL (Dark)" },
    { key: "logo_light_url", label: "Logo URL (Light)" },
  ];

  return (
    <div className="min-h-screen bg-[var(--hotel-cream)] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="font-body text-xs text-[var(--hotel-charcoal)]/50 hover:text-[var(--hotel-terracotta)]">← Dashboard</a>
            <h1 className="font-display text-3xl text-[var(--hotel-charcoal)] font-light mt-1">Site Settings</h1>
          </div>
          <button onClick={save} className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-xs tracking-[0.2em] uppercase px-8 py-2.5 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors">
            {saved ? "✓ Saved" : "Save"}
          </button>
        </div>

        {settings && (
          <div className="space-y-4">
            {fields.map(({ key, label }) => (
              <label key={key} className="flex flex-col gap-1">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">{label}</span>
                <input
                  value={settings[key] || ""}
                  onChange={e => update(key, e.target.value)}
                  className="border border-gray-200 px-4 py-2.5 text-sm focus:border-[var(--hotel-gold)] focus:outline-none"
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
