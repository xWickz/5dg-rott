<template>

    <Navbar />
    <main class="bg-gray-100 h-screen p-10">

      <h1 class="font-bold text-2xl"> Últimas Guías </h1>
      <h2 class="text-gray-500 dark:text-gray-400">Consulta las últimas guías (10) que han sido publicadas.</h2>
      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
  
      <p v-if="loading">Cargando...</p>
  
      <span v-else-if="guide && guide.length">
        <div v-for="g in guide" :key="g.id" class="mb-2">
          <h1 class="text-md hover:text-gray-600"><router-link :to="`/guide/${g.id}`">{{ g.title }}</router-link></h1>
          <h2 class="text-xs text-gray-500">{{ g.profiles?.username || 'Desconocido' }}</h2>
          <p class="text-xs">{{ formatDate(g.created_at) }}</p>
        </div>  
      </span>
  
      <span v-else class="flex flex-col items-center justify-center text-3xl">
        <p class="text-gray-500">No se encontraron guías.</p>
      </span>
    </main>
</template>

<script>
import Auth from "../Auth/components/Auth.vue";
import { store } from "../Auth/store/store";
import { supabase } from "../../lib/supabaseClient";
import { onMounted, ref } from "vue";

// Import utils 
import { formatDate } from "../../shared/utils/formatDate";

// Import shared components
import Navbar from "../../shared/ui/components/Navbar.vue";

export default {
  components: {
    Auth,
    Navbar,
  },

  setup() {
    const guide = ref(null);
    const loading = ref(true);

    onMounted(async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        store.state.user = null;
      } else {
        store.state.user = sessionData?.session?.user ?? null;
      }

      // Get user's guides
      const { data, errorLoad } = await supabase
        .from('guides')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false })
        .limit(10)

        if (errorLoad) {
          guide.value = null;
        } else {
          guide.value = data;
        }
        loading.value = false;
    });

    const logout = async () => {
      await supabase.auth.signOut();
    };

    return {
      store,
      logout,
      guide,
      loading,
      formatDate,
    };
  }
};

</script>
