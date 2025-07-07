<template>

    <Navbar />
    <main class="bg-gray-100 h-screen p-10">
        <p v-if="loading">Cargando...</p>

        <section v-else-if="guide && guide.length">
            <h1 class="text-2xl font-bold"> Lista de Guias </h1>
            <ul>
                <li v-for="g in guide" :key="g.id" class="mb-2">
                    <article>
                        <p class="text-md">
                            <router-link :to="`/guide/${g.id}`">{{ g.title }}</router-link>
                        </p>
                    </article>
                </li>
            </ul>
        </section>

        <section v-else class="flex flex-col items-center justify-center text-3xl">
            <h2 class="font-bold">¡Ha ocurrido un error!</h2>
            <p class="text-gray-500">No se pudo encontrar lo que estabas buscando.</p>
        </section>
    </main>
</template>

<script>
import { ref, onMounted } from 'vue';
import Navbar from "@/shared/ui/components/Navbar.vue";
import { supabase } from '@/lib/supabaseClient';
import { checkUserAdmin } from "@/shared/utils/checkIfUserIsAdminAndKick";

export default {
    components: {
        Navbar,
    },

    setup() {
        const guide = ref(null);
        const loading = ref(true);

        onMounted(async () => {

            checkUserAdmin();

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
