<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from './lib/supabaseClient';

const instruments = ref([]);

async function getInstruments() {
  const { data } = await supabase.from('instruments').select()
  instruments.value = data;
}

onMounted(() => {
  getInstruments();
});

// add new instrument
const newInstrumentName = ref(''); // the value we have in v-model

async function addInstrument() {
  if (!newInstrumentName.value.trim()) return;
  const { data, error } = await supabase.from('instruments').insert({
    name: newInstrumentName.value.trim()
  }).select();

  if (error) {
    console.error('Error adding ' + newInstrumentName.value + ': ', error);
  } else {
    newInstrumentName.value = ''; // clear the input field
  }
};

</script>

<template>
  <header class="px-4 py-2">

    <ul>
      <li v-for="instrument in instruments" :key="instrument.id">
        {{ instrument.name }}
      </li>

      <hr/>

      <label for="new-instrument">Add New Instrument:</label>
      <input id="new-instrument" type="text" v-model="newInstrumentName" @keyup.enter="addInstrument" placeholder="here"/>
      <button @click="addInstrument">Add</button>

    </ul>
  </header>

</template>
