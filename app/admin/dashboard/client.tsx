"use client";

const sections = [
  { name: "Users", href: "/admin/users", desc: "Manage CMS admin accounts", adminOnly: true },
  { name: "Rooms", href: "/admin/rooms", desc: "Edit room details, photos, amenities, pricing" },
  { name: "Policies", href: "/admin/policies", desc: "Manage hotel policies and cancellation" },
  { name: "Offers", href: "/admin/offers", desc: "Seasonal packages and inclusions" },
  { name: "Spa", href: "/admin/spa", desc: "Spa packages, massages, facials, body treatments, add-ons" },
  { name: "Events", href: "/admin/events", desc: "Upcoming events and activities" },
  { name: "Gallery", href: "/admin/gallery", desc: "Upload and organize site photos" },
  { name: "Settings", href: "/admin/settings", desc: "Hotel name, phone, address, logos" },
];

export default function DashboardClient({ role }: { role: string | null }) {
  const visible = sections.filter((s) => !s.adminOnly || role === "admin");

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900">CMS Dashboard</h1>
            <p className="text-lg text-neutral-600 font-medium mt-1">Andreas Hotel & Spa</p>
          </div>
          <a href="/" target="_blank" className="text-lg text-neutral-700 hover:text-amber-600 font-bold">
            View Site →
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {visible.map((s) => (
            <a
              key={s.name}
              href={s.href}
              className="block bg-white p-8 hover:shadow-lg transition-shadow border-[3px] border-neutral-300 hover:border-amber-500"
            >
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">{s.name}</h2>
              <p className="text-lg text-neutral-600 font-medium">{s.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
