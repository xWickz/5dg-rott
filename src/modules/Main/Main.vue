<template>

  <Navbar/>
  <section class="bg-gray-100 h-screen p-5">
    <!-- check if user is available in the store.js (show auth component if not) -->
    <div v-if="!store.state.user">
      Componente que solo se ve al no iniciar sesion
    </div>

    <!-- if user is logged in, show any component or what else -->
    <div v-else class="p-5">
      Componente que solo se ve al iniciar sesion

    </div>

    Componente que se ve como sea

  </section>
</template>

<script>
import Auth from "../Auth/components/Auth.vue";
import { store } from "../Auth/store/store";
import { supabase } from "../../lib/supabaseClient";
import { onMounted } from "vue";

import { useRouter } from "vue-router";

// Import shared components
import Navbar from "../../shared/ui/components/Navbar.vue";

export default {
  components: {
    Auth,
    Navbar,
  },

  setup() {
    const router = useRouter();
    // En lugar de async setup, usamos onMounted dentro
    onMounted(async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        store.state.user = null;
      } else {
        store.state.user = sessionData?.session?.user ?? null;
      }
    });

    const logout = async () => {
      await supabase.auth.signOut();
    };

    return {
      store,
      logout,
    };
  }
};

</script>
