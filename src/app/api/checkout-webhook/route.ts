import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

/*
  Checkout webhook. Point the payment provider at
    /api/checkout-webhook?secret=<CHECKOUT_WEBHOOK_SECRET>
  and every paid seat lands in aiceo_orders, counted on the owner
  dashboard. The whole payload is kept in `raw` so nothing is lost
  while the provider's exact field names settle down.
*/
export const runtime = "nodejs";

/** Providers disagree on field names; take the first one that shows up. */
function pick(o: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const parts = k.split(".");
    let v: unknown = o;
    for (const p of parts) {
      if (v && typeof v === "object" && p in (v as Record<string, unknown>)) {
        v = (v as Record<string, unknown>)[p];
      } else {
        v = undefined;
        break;
      }
    }
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return null;
}

function amountCents(o: Record<string, unknown>): number | null {
  const raw = pick(o, [
    "amount_cents",
    "amount_total",
    "amountTotal",
    "amount",
    "total",
    "data.amount",
    "data.total",
  ]);
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  /* a bare "997" is dollars, "99700" is already cents */
  return n < 10000 ? Math.round(n * 100) : Math.round(n);
}

export async function POST(request: Request) {
  const secret =
    new URL(request.url).searchParams.get("secret") ??
    request.headers.get("x-webhook-secret") ??
    "";
  if (!process.env.CHECKOUT_WEBHOOK_SECRET || secret !== process.env.CHECKOUT_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = serverClient();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 500 });

  const { error } = await supabase.rpc("aiceo_record_order", {
    p_secret: process.env.SUPABASE_ORDER_SECRET ?? "",
    p_external_id:
      pick(body, ["id", "order_id", "checkout_id", "data.id", "reference"]) ??
      `manual-${Date.now()}`,
    p_email: pick(body, ["email", "customer_email", "customer.email", "data.email"]),
    p_name: pick(body, ["name", "customer_name", "customer.name", "data.name"]),
    p_amount_cents: amountCents(body),
    p_currency: pick(body, ["currency", "data.currency"]) ?? "usd",
    p_status: pick(body, ["status", "data.status"]) ?? "paid",
    p_raw: body,
  });

  if (error) {
    console.error("order record failed:", error.code, error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  /* the purchase also belongs in the funnel */
  await supabase.from("aiceo_events").insert({
    name: "purchase",
    surface: "checkout",
    meta: { provider: "commas" },
  });

  return NextResponse.json({ ok: true });
}
