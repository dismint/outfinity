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
      <div>
        <button class="searchButton" type="submit"><span>Search</span></button>
        <button
          type="button"
          class="searchButton"
          @click="
            searchQuery = '';
            emitSearchQuery();
          "
        >
          <span>Clear</span>
        </button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.searchButton {
  margin: 1vmin 1vmin 0 0;
  padding: 1vmin;
  border: none;
  background-color: var(--light-grey);
  cursor: pointer;
  position: relative;
}

.searchButton::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  opacity: 0;
  background-color: var(--light-green);
  z-index: 11;
  transition: opacity 0.2s ease;
}

.searchButton:hover::after {
  opacity: 1;
}

.searchButton span {
  position: relative;
  z-index: 20;
}

fieldset {
  border: none;
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
