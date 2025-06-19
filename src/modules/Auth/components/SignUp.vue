<template>
    <div class="px-5">
        <h2 class="font-bold text-lg mb-2">Sign up</h2>
        <form @submit.prevent="handleSignup">
            <div>
                <label for="email">Email:</label>
                <input id="email" type="email" v-model="email" />
            </div>
            <div>
                <label for="password">Password:</label>
                <input id="password" type="password" v-model="password" />
            </div>
            <div>
                <button type="submit">Sign Up</button>
            </div>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../../../lib/supabaseClient';

export default {
    setup() {
        const email = ref("");
        const password = ref("");

        const handleSignup = async () => {
            try {
                const { error } = await supabase.auth.signUp({
                    email: email.value,
                    password: password.value,
                });

                if(error) throw error;
                
            } catch(error) {
                alert(error.error_description || error.message);
            }
        };

        return {
            email,
            password,
            handleSignup,
        };
    },
};
</script>