<template>
  
  <!-- check if user is available in the store.js (show auth component if not) -->
  <Auth v-if="!store.state.user"/>

  <!-- if user is logged in, show any component or what else -->
  <div v-else>
    bienvenido {{ store.state.user.email }}
  </div>

</template>

<script>
import Auth from "./components/Auth.vue";
import { store } from "./store";
import { supabase } from "./lib/supabaseClient";
import { onMounted } from "vue";

export default {
  components: {
    Auth,
  },

  setup() {
    // En lugar de async setup, usamos onMounted dentro
    onMounted(async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        store.state.user = null;
      } else {
        store.state.user = sessionData?.session?.user ?? null;
      }

      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") {
          store.state.user = null;
        } else {
          store.state.user = session?.user ?? null;
        }
      });
    });

    return {
      store,
    };
  }
};
</script>
