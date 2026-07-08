"use client";

import { useEffect, useState, useCallback } from "react";
import type { SiteSettings } from "@/lib/cms/types";
import { useAutoSave } from "@/lib/use-auto-save";

type Field = { key: keyof SiteSettings; label: string };

const GENERAL_FIELDS: Field[] = [
  { key: "hotel_name", label: "Hotel Name" }, { key: "tagline", label: "Tagline" },
  { key: "address", label: "Address" }, { key: "phone", label: "Phone" },
  { key: "email", label: "Email" }, { key: "booking_url", label: "Booking URL" },
  { key: "hero_video_url", label: "Hero Video URL" },
  { key: "logo_dark_url", label: "Logo URL (Dark)" }, { key: "logo_light_url", label: "Logo URL (Light)" },
];

const CONCIERGE_FIELDS: Field[] = [
  { key: "vapi_assistant_name", label: "Assistant Name" },
  { key: "vapi_first_message", label: "First Message" },
  { key: "vapi_placeholder", label: "Input Placeholder" },
];

export default function SettingsEditor() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/admin/settings").then(r => r.json()).then(d => { setSettings(d); setLoading(false); }); }, []);

  const save = useCallback(async () => {
    if (!settings) return false;
    const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    if (!res.ok) {
      const err = await res.text();
      alert("Save failed: " + err);
    }
    return res.ok;
  }, [settings]);

  const status = useAutoSave(settings, save);

  function update(field: keyof SiteSettings, value: any) { if (!settings) return; setSettings({ ...settings, [field]: value }); }

  if (loading) return <div className="min-h-screen bg-neutral-100 p-8"><p className="text-xl font-bold">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/admin/dashboard" className="text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
            <h1 className="text-4xl font-bold text-neutral-900 mt-1">Site Settings</h1>
            <p className="text-base text-neutral-500 mt-1">Edits auto-save — changes are saved as you type.</p>
          </div>
          <div className="flex items-center gap-3">
            {status === "saving" && <span className="text-lg text-neutral-500 font-bold">Saving...</span>}
            {status === "saved" && <span className="text-lg text-green-700 font-bold">Saved ✓</span>}
          </div>
        </div>

        {settings && (
          <div className="space-y-10">
            {/* General */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-6 pb-2 border-b-[3px] border-neutral-300">General</h2>
              <div className="space-y-5">
                {GENERAL_FIELDS.map(({ key, label }) => (
                  <label key={key} className="flex flex-col gap-2">
                    <span className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">{label}</span>
                    <input
                      value={String(settings[key] ?? "")}
                      onChange={e => update(key, e.target.value)}
                      className="border-[3px] border-neutral-400 px-5 py-4 text-lg font-medium focus:border-amber-500 focus:outline-none bg-neutral-50"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Concierge */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-6 pb-2 border-b-[3px] border-neutral-300">Concierge (AI Chat)</h2>
              <p className="text-lg text-neutral-600 font-medium mb-6">
                Edit the name, greeting, and placeholder text for the AI chat widget.
              </p>
              <div className="space-y-5">
                {CONCIERGE_FIELDS.map(({ key, label }) => (
                  <label key={key} className="flex flex-col gap-2">
                    <span className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">{label}</span>
                    {key === "vapi_first_message" || key === "vapi_placeholder" ? (
                      <textarea
                        value={String(settings[key] ?? "")}
                        onChange={e => update(key, e.target.value)}
                        rows={key === "vapi_first_message" ? 3 : 2}
                        className="border-[3px] border-neutral-400 px-5 py-4 text-lg font-medium focus:border-amber-500 focus:outline-none bg-neutral-50"
                      />
                    ) : (
                      <input
                        value={String(settings[key] ?? "")}
                        onChange={e => update(key, e.target.value)}
                        className="border-[3px] border-neutral-400 px-5 py-4 text-lg font-medium focus:border-amber-500 focus:outline-none bg-neutral-50"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-6 pb-2 border-b-[3px] border-neutral-300">Awards</h2>
              <p className="text-lg text-neutral-600 font-medium mb-6">
                Award badges shown on the homepage. Add image URLs (PNG preferred, ~80px height), optional link URLs, and alt text.
              </p>
              <div className="space-y-4">
                {(settings.awards || []).map((award, i) => (
                  <div key={i} className="border-2 border-solid border-neutral-300 p-4 rounded flex gap-4 items-start bg-neutral-50">
                    <span className="text-sm font-bold text-neutral-400 mt-3 w-6">{i + 1}.</span>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-[0.1em] text-neutral-500">Image URL</span>
                        <input
                          value={award.image_url || ""}
                          onChange={e => {
                            const arr = [...(settings.awards || [])];
                            arr[i] = { ...award, image_url: e.target.value };
                            update("awards", arr);
                          }}
                          placeholder="/hotel-photos/tripadvisor-award.png"
                          className="border-[2px] border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none bg-white"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-[0.1em] text-neutral-500">Link URL</span>
                        <input
                          value={award.link_url || ""}
                          onChange={e => {
                            const arr = [...(settings.awards || [])];
                            arr[i] = { ...award, link_url: e.target.value };
                            update("awards", arr);
                          }}
                          placeholder="https://tripadvisor.com/..."
                          className="border-[2px] border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none bg-white"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-[0.1em] text-neutral-500">Alt Text</span>
                        <input
                          value={award.alt_text || ""}
                          onChange={e => {
                            const arr = [...(settings.awards || [])];
                            arr[i] = { ...award, alt_text: e.target.value };
                            update("awards", arr);
                          }}
                          placeholder="TripAdvisor Award"
                          className="border-[2px] border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none bg-white"
                        />
                      </label>
                    </div>
                    <div className="flex flex-col items-center gap-2 min-w-[80px]">
                      {award.image_url && (
                        <img src={award.image_url} alt="" className="h-14 w-auto rounded border border-neutral-200" />
                      )}
                      <button
                        onClick={() => {
                          const arr = [...(settings.awards || [])];
                          arr.splice(i, 1);
                          update("awards", arr);
                        }}
                        className="text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const arr = [...(settings.awards || [])];
                    arr.push({ image_url: "", link_url: "", alt_text: "" });
                    update("awards", arr);
                  }}
                  className="w-full border-2 border-dashed border-amber-400 text-amber-600 hover:text-amber-800 hover:border-amber-600 font-bold text-sm py-3 rounded transition-colors"
                >
                  + Add New Award
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
