import { createClient } from "@supabase/supabase-js";

/*
  Server-only Supabase client. The publishable key is safe here because
  RLS is insert-only on the tables it can reach; reads happen through
  secret-gated database functions instead.
*/
export function serverClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
