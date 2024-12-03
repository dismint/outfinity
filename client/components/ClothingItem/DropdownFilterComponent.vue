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
  <div class="dropdownContainer">
    <label for="clothing-filter">Filter</label>
    <select v-model="selectedOption" @change="emitSelection" id="clothing-filter">
      <option value="" disabled>Select a type</option>
      <option v-for="option in options" :key="option" :value="option.toLowerCase()">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.dropdownContainer {
  margin-top: 2vmin;
  width: 100%;
}

label {
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
}

select {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
