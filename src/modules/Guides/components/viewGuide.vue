<template>

    <Navbar />
    <section class="bg-gray-100 min-h-screen p-10">

        <div v-if="loading">Cargando...</div>

        <div v-else-if="guide">
            <h1 class="text-3xl font-bold mb-5">{{ guide.title }}</h1>
            <p class="text-gray-400 mb-5">Publicada el {{ formatDate(guide.created_at) }}</p>
            <div v-html="guide.content" class="prose"></div>
        </div>

        <div v-else class="flex flex-col items-center justify-center text-3xl">
            <span class="font-bold">¡Ha ocurrido un error!</span>
            <span class="text-gray-500">No se pudo encontrar lo que estabas buscando.</span>
        </div>

    </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';

// Utils
import { formatDate } from '@/shared/utils/formatDate';
import Navbar from "@/shared/ui/components/Navbar.vue";

export default {
    components: {
        Navbar,
    },

    setup() {
        const route = useRoute();
        const guide = ref(null);
        const loading = ref(true);

        onMounted(async () => {
            
            const { data, error } = await supabase
                .from('guides')
                .select('*')
                .eq('id', route.params.id)
                .single();
            if (error) {
                guide.value = null;
            } else {
                guide.value = data;
            }
            loading.value = false;
            });

        return { 
            guide, 
            loading,
            formatDate
        };
    }
};
</script>
