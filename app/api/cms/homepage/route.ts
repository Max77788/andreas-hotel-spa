import { NextResponse } from "next/server";
import { getHomePageData } from "@/lib/cms/getHomePageData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getHomePageData();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch homepage CMS data:", err);
    return NextResponse.json({ error: "Failed to fetch CMS data" }, { status: 500 });
  }
}
