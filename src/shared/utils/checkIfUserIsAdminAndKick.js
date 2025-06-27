/* Check if user is admin and kick */
/* This is a module that check if user is admin */
/* If user is not an admin they get kicked out. */

import router from '../../router';
import { supabase } from '../../lib/supabaseClient';

export async function checkUserAdmin() {
  const { data: userData } = await supabase.auth.getUser();

  // If user is not logged in, redirect to homepage
  if (!userData?.user) router.push("/");

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (data.role !== "admin") {
    router.push("/");
  }
}


