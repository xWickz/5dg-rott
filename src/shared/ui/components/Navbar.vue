<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">[5DG] ROTT</span>
      </a>

      <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center relative">

        <!-- Mostrar si no ha iniciado sesión -->
        <button
          v-if="!store.state.user"
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <router-link to="/login">Iniciar Sesión</router-link>
        </button>

        <!-- Mostrar si el usuario ha iniciado sesión -->
        <div v-else class="relative">
          <button
            @click="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-2 text-gray-800 dark:text-white hover:text-blue-600 font-medium focus:outline-none"
          >
            {{ username || store.state.user.email }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-show="dropdownOpen"
            @click.outside="dropdownOpen = false"
            class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700 z-50"
          >
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li>
                    <span class="px-4 py-2 block font-semibold">
                        {{ role === "user" ? "Usuario" : "Admin" }}
                    </span>
                    <hr/>
                </li>
                
              <li>
                <a href="#" @click="logout" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Cerrar sesión
                </a>
              </li>
              <!-- Agrega más opciones aquí si deseas -->
            </ul>
          </div>
        </div>

        <!-- Botón para menú colapsable en móviles -->
        <button
          data-collapse-toggle="navbar-cta"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-cta"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

      </div>

      <!-- Enlaces del navbar -->
      <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
        <ul
          class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <a href="#" class="block py-2 px-3 md:p-0 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
              aria-current="page">
              Inicio
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'
import { store } from '../../../modules/Auth/store/store'
import { supabase } from '../../../lib/supabaseClient'

export default {
  setup() {
    const dropdownOpen = ref(false)
    const username = ref("");
    const role = ref("");

    // Manejo de clic fuera del dropdown
    onMounted(async () => {
        const { data: userData } = await supabase.auth.getUser();
        if(!userData?.user) return;

        const { data, error } = await supabase 
        .from("profiles")
        .select("username, role")
        .eq("id", userData.user.id)
        .single();

        if(!error && data) {
            username.value = data.username;
            role.value = data.role;
        }

        document.addEventListener('click', (e) => {
            const dropdown = document.querySelector('.dropdown-menu')
            if (dropdown && !dropdown.contains(e.target)) {
            dropdownOpen.value = false
            }
        })
    })

    const logout = async () => {
      await supabase.auth.signOut()
    }

    return {
      store,
      dropdownOpen,
      logout,
      username,
      role,
    }
  },
}
</script>