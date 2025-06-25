<template>

    <Navbar />
    <section class="bg-gray-100 h-screen p-10">
        <div v-if="loading">Cargando...</div>

        <div v-else-if="guide && guide.length">
            <div v-for="g in guide" :key="g.id" class="mb-2">
                <h1 class="text-md"><router-link :to="`/viewGuide/${g.id}`">{{ g.title }}</router-link></h1>
            </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center text-3xl">
        <span class="font-bold">¡Ha ocurrido un error!</span>
        <span class="text-gray-500">No se pudo encontrar lo que estabas buscando.</span>
        </div>
    </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import Navbar from "@/shared/ui/components/Navbar.vue";
import { supabase } from '@/lib/supabaseClient';
import { checkUserAdmin } from "@/shared/utils/checkIfUserIsAdmin";

export default {
    components: {
        Navbar,
    },

    setup() {

        onMounted(async () => {
            checkUserAdmin();
        });

        const guide = ref(null);
        const loading = ref(true);

        onMounted(async () => {
            const { data, error } = await supabase
                .from('guides')
                .select('*')
            if (error) {
                guide.value = null;
            } else {
                guide.value = data;
            }
            loading.value = false;
        });

        return {
            guide,
            loading
        };
    }
};
</script>
