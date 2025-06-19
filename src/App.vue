<template>
  
  <section class="bg-gray-100 h-screen p-2">

    <!-- check if user is available in the store.js (show auth component if not) -->
    <Auth v-if="!store.state.user"/>
  
    <!-- if user is logged in, show any component or what else -->
    <div v-else>
      bienvenido {{ store.state.user.email }} !
  
    <button type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" @click="logout">
      Salir
    </button>

    </div>

  </section>
</template>

<script>
import Auth from "./modules/Auth/components/Auth.vue";
import { store } from "./modules/Auth/store/store";
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

    const logout = async () => {
      await supabase.auth.signOut();
    };

    return {
      store,
      logout,
    };
  }
};

console.log(store.state.user.id)
</script>
