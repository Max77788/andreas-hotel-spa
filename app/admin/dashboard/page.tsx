import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import DashboardClient from "./client";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const session = token ? await verifySessionToken(token) : null;

  return <DashboardClient role={session?.role ?? null} />;
}
