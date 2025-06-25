<template>
    <Navbar/>

    <section class="bg-gray-100 h-screen p-10">
        
        <div class="mb-5">
            <span class="font-bold text-2xl">Crear Publicacion</span> <br/>
            <span class="font-semibold text-lg">¡Es hora de crear una guía!</span>
        </div>

        <form @submit.prevent="uploadPost">
            <label for="postTitle" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Título</label>
            <input v-model="postTitle" type="text" id="postTitle" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
            
            <label for="postContent" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-5">Contenido</label>

            <ckeditor
                v-model="postContent"
                :editor="ClassicEditor"
                :config="config"
            />

            <button type="submit" class="mt-5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                Publicar
            </button>
        </form>

    </section>
</template>

<script>
import Navbar from "../../shared/ui/components/Navbar.vue";
import { supabase } from "../../lib/supabaseClient";
import { ref, computed, onMounted } from 'vue';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Code } from 'ckeditor5';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import router from "../../router";
import 'ckeditor5/ckeditor5.css';

export default {
    components: {
        Navbar,
        Ckeditor
    },
    setup() {

        onMounted(async () => {
            const { data: userData } = await supabase.auth.getUser();

            // If user is not logged in, redirect to homepage
            if(!userData?.user) router.push("/");

            const { data, error } = await supabase 
            .from("profiles")
            .select("role")
            .eq("id", userData.user.id)
            .single();

            if(data.role !== "admin") {
                router.push("/");
            }

        });

        const postContent = ref('<p>Tu contenido va aquí!</p>');
        const postTitle = ref('');

        const config = computed(() => ({
            licenseKey: 'GPL',
            plugins: [Essentials, Paragraph, Bold, Italic, Code],
            toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'code', '|']
        }));

        const uploadPost = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if(!user) {
                    alert("Debes iniciar sesión para publicar.");
                    return;
                }

                const { data, error } = await supabase.from("guides").insert([
                    {
                        title: postTitle.value,
                        content: postContent.value,
                        author: user.id,
                    }
                ]);

                if(error) {
                    alert(error.message || "Ocurrió un error durante el registro.");
                    return;
                }

                alert("¡Guía creada!");
                postTitle.value = "";
                postContent.value = "";

            } catch(err) {
                alert(err.error_description || err.message || "Error inesperado.");
            }
        }
            
        return {
            postContent,
            postTitle,
            config,
            ClassicEditor,
            uploadPost
        };
    }
};
</script>