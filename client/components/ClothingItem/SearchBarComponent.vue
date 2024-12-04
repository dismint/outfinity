<script setup lang="ts">
import { defineEmits, ref } from "vue";

const searchQuery = ref("");
const emit = defineEmits(["update:query"]);

function emitSearchQuery() {
  emit("update:query", searchQuery.value);
}
</script>

<template>
  <form @submit.prevent="emitSearchQuery" class="searchContainer">
    <h2>Search</h2>
    <fieldset>
      <input id="text" type="text" v-model="searchQuery" placeholder="Search" />
      <button type="submit">Search</button>
      <button
        type="button"
        @click="
          searchQuery = '';
          emitSearchQuery();
        "
      >
        Clear
      </button>
    </fieldset>
  </form>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.searchContainer {
  margin-top: 1em;
  width: 100%;
}

h2 {
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
}

input {
  width: 100%;
  height: 1.6em;
}
</style>
