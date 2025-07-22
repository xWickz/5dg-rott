    <template>
<div class="w-max h-max max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
            {{ diaActual.toUpperCase() }}: {{ infoDia.titulo }}
        </h5>
   </div>

   <div class="flow-root">
        <ol role="list" class="divide-y divide-gray-200 dark:divide-gray-700 list-decimal" v-if="infoDia.tareas.length > 0"> 
            <li v-for="(tarea, index) in infoDia.tareas" :key="index" class="py-3 sm:py-4">
                <div class="flex items-center">
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {{ tarea }}
                        </p>
                    </div>
                </div>    
            </li>
        </ol>

        <p v-else>Dia libre!</p>
   </div>

   
</div>

</template>

<script setup>
import versusLastWar from "@/modules/Main/utils/vs_days.json";

const diasSemanas = [
    "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"
];

const hoy = new Date();
const diaActual = diasSemanas[hoy.getDay()];
const infoDia = versusLastWar[diaActual];
</script>