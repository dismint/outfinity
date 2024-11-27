<script setup lang="ts">
import { defineEmits, ref } from "vue";

// Options for dropdown
const options = ["Top", "Bottom", "One-piece", "Hat", "Shoe"];
const selectedOption = ref("");
const emit = defineEmits(["update:filter"]);

// Emits the selected option to the parent component
function emitSelection() {
  emit("update:filter", selectedOption.value);
}
</script>

<template>
  <div>
    <label for="clothing-filter">Filter by:</label>
    <select v-model="selectedOption" @change="emitSelection" id="clothing-filter">
      <option value="" disabled>Select a type</option>
      <option v-for="option in options" :key="option" :value="option.toLowerCase()">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<style scoped>
div {
  margin: 0.5em 0;
}

select {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
