import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css';
import router from './router';
import { supabase } from './lib/supabaseClient';
import { store } from './modules/Auth/store/store';

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

app.use(router);
app.mount('#app');
