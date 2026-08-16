"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

export type LeadState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/*
  Insert-only capture into aiceo_leads. RLS allows anon insert and
  nothing else, so the publishable key here can never read data.
  Spam economics: hidden "company" honeypot and a sub-1.5s time trap
  both return a silent success so bots learn nothing.
*/
export async function submitLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  const honeypot = String(formData.get("company") ?? "");
  const startedAt = Number(formData.get("t") ?? 0);
  if (honeypot.length > 0) return { status: "success" };
  if (!startedAt || Date.now() - startedAt < 1500)
    return { status: "success" };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const source = String(formData.get("source") ?? "site").slice(0, 40);

  if (name.length < 1 || name.length > 120 || !EMAIL_RE.test(email)) {
    return { status: "error", message: "invalid" };
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error("lead: missing Supabase env vars");
    return { status: "error", message: "server" };
  }

  const h = await headers();
  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });
  const { error } = await supabase.from("aiceo_leads").insert({
    name,
    email,
    source,
    user_agent: h.get("user-agent")?.slice(0, 300) ?? null,
    referer: h.get("referer")?.slice(0, 300) ?? null,
  });

  if (error) {
    // Duplicate email means they are already in: treat as success.
    if (error.code === "23505") return { status: "success" };
    console.error("lead insert failed:", error.code, error.message);
    return { status: "error", message: "server" };
  }
  return { status: "success" };
}
