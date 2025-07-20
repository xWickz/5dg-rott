<template>
  <main>
    <div class="h-screen flex items-center justify-center">
      <div class="w-full h-full grid lg:grid-cols-2">
        <div class="max-w-xs m-auto w-full flex flex-col items-center">
          <p class="h-9 w-9">Rott</p>
          <p class="mt-4 text-xl font-bold tracking-tight">
            Iniciar sesion
          </p>

          <form class="w-full space-y-4" @submit.prevent="handleSignin">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo</label>
            <input v-model="email" type="email" id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="tucorreo@gmail.com" required autocomplete />

            <label for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
            <input v-model="password" type="password" id="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required />

            <button type="submit"
              class="mt-4 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
              Iniciar sesion
            </button>
          </form>

          <div class="mt-5 space-y-5">
            <p class="text-sm text-center">
              No tienes cuenta? <router-link to="/register" class="ml-1 underline text-muted-foreground">Crea una
                aqui</router-link>
            </p>
          </div>
        </div>

        <div class="bg-gray-100 hidden lg:block">
          <img class="h-full w-full object-cover blur-xs" src="/src/assets/images/lastwar_bg.jpg"
            alt="Fondo de pantalla del juego Last War" />
        </div>
      </div>
    </div>
  </main>

</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const email = ref("");
        const password = ref("");


        const handleSignin = async () => {
            try {
                const { error } = await supabase.auth.signInWithPassword({
                    email: email.value,
                    password: password.value,
                });

                if(error) throw error;
            } catch(error) {
                alert(error.error_description || error.message);
            }
        };


        // En lugar de async setup, usamos onMounted dentro
        onMounted(async () => {
          const { data: sessionData, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Error getting session:", error);
          } 

        supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN") {
              router.push({ path: '/' });
              console.info("El usuario entro sesion pero aun no fue guardada su sesion en el store.");
            }
          });
        });

        return {
            email,
            password,
            handleSignin,
        };
    },
};
</script>