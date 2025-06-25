<template>
    <Navbar/>

    <section class="bg-gray-100 h-screen p-10">
        
        <div class="mb-5">
            <span class="font-bold text-2xl">Crear Publicacion</span> <br/>
            <span class="text-gray-500 text-lg">¡Es hora de crear una guía! Lucete!</span>
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

        <div class="mt-5 max-w-lg text-justify">
            <span class="font-bold text-2xl">Manual de Usuario</span> <br/>
            <span class="text-gray-500 text-lg">Saludos familia, aquí van a poder crear las guías. Podrán agregar contenido a como deseen
                Tienen a su disposición las herramientas básicas pero que son las útiles para las guías, como por ejemplo: agregar imagenes, tablas, estilar el texto.
                Si hace falta alguna herramienta más, haganlo saber y será implementada a la medida de lo posible.
                Este es un editor WYSIWYG (What You See Is What You Get), todo lo que vayan estilando, será exactamente
                lo que van a ver en la publicación subida.
            </span>
        </div>
    </section>
</template>

<script>
import { supabase } from "@/lib/supabaseClient";
import { ref, computed, onMounted } from 'vue';

// CKEditor
import { 
    ClassicEditor, 
    Essentials, 
    Paragraph, 
    Bold, 
    Italic, 
    Code, 
    Table, 
    TableToolbar, 
    Image, 
    ImageInsert, 
    ImageStyle, 
    ImageResize, 
    ImageToolbar, 
    MediaEmbed, 
    MediaEmbedToolbar, 
    Font, 
    Heading,
    Alignment,
    List } from 'ckeditor5';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import 'ckeditor5/ckeditor5.css';

// Utils
import { checkUserAdmin } from "@/shared/utils/checkIfUserIsAdmin";
import Navbar from "@/shared/ui/components/Navbar.vue";

export default {
    components: {
        Navbar,
        Ckeditor
    },
    setup() {

        onMounted(async () => {
            checkUserAdmin();
        });

        const postContent = ref('');
        const postTitle = ref('');

        const config = computed(() => ({
            licenseKey: 'GPL',
            plugins: [ Essentials, Paragraph, Bold, Italic, Code, Table, TableToolbar, Image, ImageInsert, ImageStyle, ImageResize, ImageToolbar, MediaEmbed, MediaEmbedToolbar, Font, Heading, Alignment, List ],
            toolbar: [ 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'heading', 'bulletedList', 'numberedList', '|', 'undo', 'redo', '|', 'bold', 'italic', 'code', 'insertTable', 'alignment', '|', 'imageInsert', 'mediaEmbed' ],
            table: {
                contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
            },
            image: {
                toolbar: [
                   'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
                    '|', 'imageTextAlternative', '|', 'imageResize'
                ]
            },
            fontFamily: {
                options: [
                    'default',
                    'Ubuntu, Arial, sans-serif',
                    'Ubuntu Mono, Courier New, Courier, monospace',
                    'Arial'
                ]
            },
            heading: {
                options: [
                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
                ]
            },
            list: {
                properties: {
                    styles: true,
                    startIndex: true,
                    reversed: true
                }
            }
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