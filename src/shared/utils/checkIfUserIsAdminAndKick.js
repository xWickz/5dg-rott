import router from "@/router";
import { supabase } from "@/lib/supabaseClient";

export async function checkUserAdmin() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (error) {
    console.error(error.message || "Ocurrió un error inesperado");
  }

  if (data.role !== "admin") {
    router.push("/");
  }
}
