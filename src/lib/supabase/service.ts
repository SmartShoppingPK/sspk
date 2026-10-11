import { createClient } from "@supabase/supabase-js";
import { supabaseServiceKey, supabaseUrl } from "./env";

// SERVER ONLY. Bypasses row-level security. Used only to record clicks.
// Never import this file from a client component.
export function createServiceClient() {
  return createClient(supabaseUrl(), supabaseServiceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
