<template>
<div class="w-max h-max max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Últimas Publicaciones
        </h5>
   </div>
   <div class="flow-root">
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">

            <li v-for="g in guide" :key="g.id" class="py-3 sm:py-4">
                <div class="flex items-center">
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            <a :href="`/guide/${g.id}`">{{ g.title }}</a>
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            {{ g.profiles?.username || 'Desconocido' }}
                        </p>
                    </div>
                </div>
            </li>

        </ul>
   </div>
</div>

</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';

export default {
    setup() {
        const guide = ref(null);
        const loading = ref(true);

        onMounted(async () => {
            const { data, error } = await supabase
                .from('guides')
                .select('*, profiles(username)')
                .order('created_at', { ascending: false })
                .limit(10)
            if(error) {
                guide.value = null;
            } else {
                guide.value = data;
            }
            loading.value = false;
        });

        return {
            guide,
            loading,
        }
    }
}
</script>