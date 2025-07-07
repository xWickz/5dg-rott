<template>

    <Navbar />
    <main class="bg-gray-100 min-h-screen p-10">

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">

            <p v-if="loading">Cargando...</p>

            <div v-else-if="guide" class="col-span-2">
                <h1 class="text-3xl font-bold mb-5">{{ guide.title }}</h1>
                <time class="text-gray-400 mb-5" :datetime="guide.created_at">
                    Publicada el {{ formatDate(guide.created_at) }}
                </time>
                <button v-if="isAdmin" type="button"
                    class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    <router-link :to="`/edit/${guide.id}`">Editar Guía</router-link>
                </button>

                <section v-html="guide.content" class="prose ck-content"></section>
            </div>

            <section v-else class="flex flex-col items-center justify-center text-3xl">
                <h1 class="font-bold">¡Ha ocurrido un error!</h1>
                <p class="text-gray-500">No se pudo encontrar lo que estabas buscando.</p>
            </section>

            <aside class="grid px-10 hidden md:block">
                <widgetLatestPost />
            </aside>

        </div>
    </main>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';

// Utils
import { formatDate } from '@/shared/utils/formatDate';
import Navbar from "@/shared/ui/components/Navbar.vue";
import widgetLatestPost from "@/shared/ui/widgets/latestPosts.vue";

import 'ckeditor5/ckeditor5.css';
import { checkUserAdmin } from '@/shared/utils/checkIfUserIsAdmin';

export default {
    components: {
        Navbar,
        widgetLatestPost
    },

    setup() {
        const route = useRoute();
        const guide = ref(null);
        const loading = ref(true);
        const isAdmin = ref(false);

        onMounted(async () => {

            isAdmin.value = await checkUserAdmin();

            const parameters = route.params.slug;
            let data, error;

            if (/^\d+$/.test(parameters)) {
                ({ data, error } = await supabase
                    .from('guides')
                    .select('*')
                    .eq('id', parameters)
                    .single());
            }

            if (!data) {
                ({ data, error } = await supabase
                    .from('guides')
                    .select('*')
                    .eq('custom_url', parameters)
                    .single());
            }

            if (error || !data) {
                guide.value = null;
            } else {
                guide.value = data;
            }
            loading.value = false;
        });

        return {
            guide,
            loading,
            formatDate,
            isAdmin
        };
    }
};
</script>
