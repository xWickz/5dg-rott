import { createApp } from 'vue'
import { supabase } from './lib/supabaseClient'
import { store } from './modules/Auth/store/store'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import './assets/style.css'

const app = createApp(App);

supabase.auth.getSession().then(({ data: { session } }) => {
    store.state.user = session?.user ?? null;
});

supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT") {
    store.state.user = null;
    router.push('/login');
    console.info("La sesión fue destruida del store.");
  } else if (event === "SIGNED_IN") {
    store.state.user = session?.user ?? null;
    console.info("La sesión fue guardada en el store.");
  }
});

app.use(PrimeVue);
app.use(ToastService);

app.use(router);
app.mount('#app');
