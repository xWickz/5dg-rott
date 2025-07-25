<template>
    <Navbar />

    <main class="bg-gray-100 h-screen p-10">

        <p v-if="loading">Cargando...</p>

        <form v-else @submit.prevent="updateGuide" class="space-y-4">
            <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Título</label>
            <input v-model="title" type="text" id="title"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required />

            <label for="content"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-5">Contenido</label>
            <ckeditor v-model="content" :editor="ClassicEditor" :config="config" />

            <button v-if="canEdit" type="submit"
                class="mt-5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                Guardar cambios
            </button>

            <p v-else class="text-red-500 mt-2">No tienes permiso para editar esta guía.</p>

        </form>

        <p v-if="errorMsg" class="text-red-500 mt-2">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-green-600 mt-2">{{ successMsg }}</p>

    </main>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';

// Router
import router from '@/router';

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
    List,
    HorizontalLine
} from 'ckeditor5';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import 'ckeditor5/ckeditor5.css';

// Utils
import Navbar from '@/shared/ui/components/Navbar.vue';

export default {
    components: {
        Navbar,
        Ckeditor
    },

    setup() {
        const route = useRoute();
        const loading = ref(true);
        const title = ref('');
        const content = ref('');
        const errorMsg = ref('');
        const successMsg = ref('');
        const canEdit = ref(false);

        const config = computed(() => ({
            licenseKey: 'GPL',
            plugins: [
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
                List,
                HorizontalLine],
            toolbar: [
                'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'heading', 'bulletedList', 'numberedList', '|',
                'undo', 'redo', '|',
                'bold', 'italic', 'code', 'insertTable', 'alignment', 'horizontalLine', '|',
                'imageInsert', 'mediaEmbed'],
            table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
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

        onMounted(async () => {
            // Obtener usuario actual
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData?.user?.id;

            const { data, error } = await supabase
                .from('guides')
                .select('*')
                .eq('id', route.params.id)
                .single();
            if (error) {
                errorMsg.value = 'No se pudo cargar la guía.';
            } else {
                title.value = data.title;
                content.value = data.content;

                // Match post author(uuid) with user(uuid)
                canEdit.value = userId && data.author === userId;
            }
            loading.value = false;

            // Kick user if can't edit LOL
            if (!canEdit.value) {
                router.push("/");
            }
        });

        const updateGuide = async () => {
            errorMsg.value = '';
            successMsg.value = '';
            if (!canEdit.value) {
                errorMsg.value = 'No tienes permiso para editar esta guía.';

                return;
            }
            const { error } = await supabase
                .from('guides')
                .update({ title: title.value, content: content.value })
                .eq('id', route.params.id);
            if (error) {
                errorMsg.value = 'Error al guardar cambios.';
            } else {
                successMsg.value = '¡Guía actualizada!';
            }
        };

        return {
            loading,
            title,
            content,
            updateGuide,
            errorMsg,
            successMsg,
            ClassicEditor,
            config,
            canEdit
        };
    }
};
</script>