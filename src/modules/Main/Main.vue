<template>

  <Navbar />
  <section class="bg-gray-100 h-screen p-10">

    <span class="font-bold text-2xl"> Últimas Guías </span>
    <p class="text-gray-500 dark:text-gray-400">Consulta las últimas guías (10) que han sido publicadas.</p>
    <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">

    <div v-if="loading">Cargando...</div>

    <div v-else-if="guide && guide.length">
      <div v-for="g in guide" :key="g.id" class="mb-2">
        <span class="text-md"><router-link :to="`/guide/${g.id}`">{{ g.title }}</router-link></span>
        <span class="text-xs text-gray-500"> &nbsp; {{ g.profiles?.username || 'Desconocido' }}</span>
        <p class="text-xs">{{ formatDate(g.created_at) }}</p>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center text-3xl">
      <span class="text-gray-500">No se encontraron guías.</span>
    </div>
    
  </section>
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
