<script setup lang="ts">
import { defineEmits, ref } from "vue";

const searchQuery = ref("");
const emit = defineEmits(["update:query"]);

function emitSearchQuery() {
  emit("update:query", searchQuery.value);
}
</script>

<template>
  <div>
    <input v-model="searchQuery" @input="emitSearchQuery" type="text" placeholder="Search for clothes..." />
  </div>
</template>

<style scoped>
div {
  margin: 0.5em 0;
}

input {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
