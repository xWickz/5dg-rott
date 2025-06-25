<template>

  <section class="bg-gray-100 h-screen p-2 flex justify-center items-center">
    <form class="w-sm shadow-2xl p-3 rounded-sm bg-gray-200" @submit.prevent="handleSignup">
      <div class="font-bold text-2xl mb-4 text-center">
      Crear Cuenta
      </div>
      <div class="mb-5">
        <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre de Usuario</label>
        <input v-model="username" type="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
      </div>
      <div class="mb-5">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo</label>
        <input v-model="email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="tucorreo@gmail.com" required />
      </div>
      <div class="mb-5">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
        <input v-model="password" type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
      </div>
      <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Crear Cuenta</button>
      ¿Ya tienes cuenta? <router-link to="/login">Inicia sesion</router-link>
    </form>
  </section>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const username = ref("");

    const handleSignup = async () => {
      if (!username.value.trim()) {
        alert("Debes ingresar un nombre de usuario.");
        return;
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.value,
          password: password.value,
        });

        if (error) {
          alert(error.message || "Ocurrió un error durante el registro.");
          return;
        }

        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").insert([
            {
              id: data.user.id,
              username: username.value,
              role: "user",
            },
          ]);

          if (profileError) {
            console.error("Error al guardar perfil:", profileError);
            alert("Error al guardar el perfil.");
            return;
          }
        }

        if (!data.session) {
          alert("Cuenta creada. Revisa tu correo para confirmar tu cuenta.");
        } else {
          alert("Cuenta creada con éxito.");
        }

      } catch (err) {
        alert(err.error_description || err.message || "Error inesperado.");
      }
    };

    return {
      email,
      password,
      username,
      handleSignup,
    };
  },
};
</script>