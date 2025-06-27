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


