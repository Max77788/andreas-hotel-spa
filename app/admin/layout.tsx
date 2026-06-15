import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import AdminNav from "./nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const session = token ? await verifySessionToken(token) : null;

  return (
    <div>
      <AdminNav session={session} />
      {children}
    </div>
  );
}
