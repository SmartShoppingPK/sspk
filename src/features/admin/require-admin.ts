import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Call this at the top of every admin page and every admin server action.
// Middleware already blocks non-admins, this is the second lock on the door.
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login");

  return { supabase, user };
}
