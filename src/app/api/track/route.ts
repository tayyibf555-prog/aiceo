import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

/*
  First-party telemetry sink: pageviews and named conversion events
  land in aiceo_events, which only the owner dashboard can read. No
  cookies, no cross-site identifiers: the session id is a random
  string the browser keeps for the tab and nothing more.
*/
export const runtime = "nodejs";

const MAX = (s: unknown, n: number) =>
  typeof s === "string" && s.length ? s.slice(0, n) : null;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const name = MAX(body.name, 60);
  if (!name) return NextResponse.json({ ok: false }, { status: 400 });

  const supabase = serverClient();
  if (!supabase) {
    console.error("track: missing Supabase env vars");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const meta =
    body.meta && typeof body.meta === "object" && !Array.isArray(body.meta)
      ? (body.meta as Record<string, unknown>)
      : {};

  const { error } = await supabase.from("aiceo_events").insert({
    name,
    path: MAX(body.path, 300),
    referrer: MAX(body.referrer, 300),
    session_id: MAX(body.session_id, 64),
    surface: MAX(body.surface, 30) ?? "site",
    meta,
  });

  if (error) {
    console.error("track insert failed:", error.code, error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
