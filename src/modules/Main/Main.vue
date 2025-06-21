<template>
  
  <section class="bg-gray-100 h-screen p-2">

    <!-- check if user is available in the store.js (show auth component if not) -->
    <div v-if="!store.state.user">
      no has iniciado sesion jefe, <router-link to="/login">inicia aqui</router-link>
    </div>

    <!-- if user is logged in, show any component or what else -->
    <div v-else class="p-5">
      te acordas de no has iniciado sesion jefe? ya no se ve
      <br/>
      Bienvenido <span class="font-bold">{{ store.state.user.email }}</span>!
      <br/>
    <button type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" @click="logout">
      Salir
    </button>

    </div>


  </section>
</template>

<script>
import Auth from "../Auth/components/Auth.vue";
import { store } from "../Auth/store/store";
import { supabase } from "../../lib/supabaseClient";
import { onMounted } from "vue";

import { useRouter } from "vue-router";


export default {
  components: {
    Auth,
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
