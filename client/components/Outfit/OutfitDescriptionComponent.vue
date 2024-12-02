<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps(["outfit"]);
</script>

<template>
  <main>
    <h1>{{ props.outfit.name }}</h1>
    <p v-if="props.outfit.description">{{ props.outfit.description }}</p>
    <p v-else>No description</p>
    <!-- <button @click="woreOutfit">I wore this today!</button> -->
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
}

img {
  width: 30%;
  height: auto;
  cursor: pointer;
}
</style>
