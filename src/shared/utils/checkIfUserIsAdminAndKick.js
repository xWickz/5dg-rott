import router from '../../router';
import { supabase } from '../../lib/supabaseClient';

/**
 * Verifica el el usuario es admin.
 * Retorna true si es admin, false si no lo es o no está logeado
 * Si no es admin, lo envía de vuelta a la página de inicio
 */
export async function checkUserAdmin() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (data.role !== "admin") {
    router.push("/");
  }
}


