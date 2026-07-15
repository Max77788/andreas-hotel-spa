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
    <div className="min-h-screen bg-neutral-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-6 sm:mb-8 gap-2">
          <div>
            <a href="/admin/dashboard" className="text-sm sm:text-lg text-neutral-600 hover:text-amber-600 font-bold">← Dashboard</a>
            <h1 className="text-2xl sm:text-4xl font-bold text-neutral-900 mt-1">Site Settings</h1>
            <p className="text-xs sm:text-base text-neutral-500 mt-1">Edits auto-save — changes are saved as you type.</p>
          </div>
          <div className="flex items-center gap-3 pt-5 sm:pt-0">
            {status === "saving" && <span className="text-sm sm:text-lg text-neutral-500 font-bold">Saving...</span>}
            {status === "saved" && <span className="text-sm sm:text-lg text-green-700 font-bold">Saved ✓</span>}
          </div>
        </div>

        {settings && (
          <div className="space-y-10">
            {/* General */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-4 sm:mb-6 pb-2 border-b-[3px] border-neutral-300">General</h2>
              <div className="space-y-4 sm:space-y-5">
                {GENERAL_FIELDS.map(({ key, label }) => (
                  <label key={key} className="flex flex-col gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">{label}</span>
                    <input
                      value={String(settings[key] ?? "")}
                      onChange={e => update(key, e.target.value)}
                      className="border-[3px] border-neutral-400 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg font-medium focus:border-amber-500 focus:outline-none bg-neutral-50 rounded-sm"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Concierge */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-4 sm:mb-6 pb-2 border-b-[3px] border-neutral-300">Concierge (AI Chat)</h2>
              <p className="text-sm sm:text-lg text-neutral-600 font-medium mb-4 sm:mb-6">
                Edit the name, greeting, and placeholder text for the AI chat widget.
              </p>
              <div className="space-y-4 sm:space-y-5">
                {CONCIERGE_FIELDS.map(({ key, label }) => (
                  <label key={key} className="flex flex-col gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-neutral-600">{label}</span>
                    {key === "vapi_first_message" || key === "vapi_placeholder" ? (
                      <textarea
                        value={String(settings[key] ?? "")}
                        onChange={e => update(key, e.target.value)}
                        rows={key === "vapi_first_message" ? 3 : 2}
                        className="border-[3px] border-neutral-400 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg font-medium focus:border-amber-500 focus:outline-none bg-neutral-50 rounded-sm"
                      />
                    ) : (
                      <input
                        value={String(settings[key] ?? "")}
                        onChange={e => update(key, e.target.value)}
                        className="border-[3px] border-neutral-400 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg font-medium focus:border-amber-500 focus:outline-none bg-neutral-50 rounded-sm"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-4 sm:mb-6 pb-2 border-b-[3px] border-neutral-300">Awards</h2>
              <p className="text-sm sm:text-lg text-neutral-600 font-medium mb-4 sm:mb-6">
                Award badges shown on the homepage. Add image URLs (PNG preferred, ~80px height), optional link URLs, and alt text.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {(settings.awards || []).map((award, i) => (
                  <div key={i} className="border-2 border-solid border-neutral-300 rounded bg-neutral-50 overflow-hidden">
                    {/* Mobile: stacked layout; Desktop: side-by-side */}
                    <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {/* Number (hidden on mobile, shown alongside title) */}
                      <span className="hidden sm:block text-sm font-bold text-neutral-400 mt-3 w-6 flex-shrink-0">{i + 1}.</span>

                      {/* Image preview + number on mobile */}
                      <div className="flex items-center gap-3 sm:hidden mb-1">
                        <span className="text-sm font-bold text-neutral-400">{i + 1}.</span>
                        {award.image_url && (
                          <img src={award.image_url} alt="" className="h-10 w-auto rounded border border-neutral-200" />
                        )}
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] text-neutral-500">Image</span>
                          <div className="flex gap-1">
                            <input
                              value={award.image_url || ""}
                              onChange={e => {
                                const arr = [...(settings.awards || [])];
                                arr[i] = { ...award, image_url: e.target.value };
                                update("awards", arr);
                              }}
                              placeholder="/hotel-photos/tripadvisor-award.png"
                              className="flex-1 border-[2px] border-neutral-300 px-2.5 sm:px-3 py-2 text-sm focus:border-amber-500 focus:outline-none bg-white rounded-sm"
                            />
                            <label className="flex items-center justify-center w-9 h-9 border-[2px] border-dashed border-amber-400 rounded-sm cursor-pointer hover:bg-amber-50 flex-shrink-0" title="Upload image">
                              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                              <input type="file" accept="image/*" className="hidden"
                                onChange={async e => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                                  if (!res.ok) return;
                                  const { url } = await res.json();
                                  const arr = [...(settings.awards || [])];
                                  arr[i] = { ...award, image_url: url };
                                  update("awards", arr);
                                }}
                              />
                            </label>
                          </div>
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] text-neutral-500">Link URL</span>
                          <input
                            value={award.link_url || ""}
                            onChange={e => {
                              const arr = [...(settings.awards || [])];
                              arr[i] = { ...award, link_url: e.target.value };
                              update("awards", arr);
                            }}
                            placeholder="https://tripadvisor.com/..."
                            className="border-[2px] border-neutral-300 px-2.5 sm:px-3 py-2 text-sm focus:border-amber-500 focus:outline-none bg-white rounded-sm"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] text-neutral-500">Alt Text</span>
                          <input
                            value={award.alt_text || ""}
                            onChange={e => {
                              const arr = [...(settings.awards || [])];
                              arr[i] = { ...award, alt_text: e.target.value };
                              update("awards", arr);
                            }}
                            placeholder="TripAdvisor Award"
                            className="border-[2px] border-neutral-300 px-2.5 sm:px-3 py-2 text-sm focus:border-amber-500 focus:outline-none bg-white rounded-sm"
                          />
                        </label>
                      </div>

                      {/* Desktop: sidebar with image + remove */}
                      <div className="hidden sm:flex flex-col items-center gap-2 min-w-[80px] flex-shrink-0">
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

                    {/* Mobile: remove button at bottom */}
                    <div className="sm:hidden border-t border-neutral-200 px-3 py-2 flex justify-end">
                      <button
                        onClick={() => {
                          const arr = [...(settings.awards || [])];
                          arr.splice(i, 1);
                          update("awards", arr);
                        }}
                        className="text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1.5"
                      >
                        Remove Award
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
