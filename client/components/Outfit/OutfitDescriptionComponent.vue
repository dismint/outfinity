<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps(["outfit"]);
</script>

<template>
  <div class="centered">
    <h2>{{ props.outfit.name }}</h2>
    <p v-if="props.outfit.description">{{ props.outfit.description }}</p>
    <p v-else>No description</p>
    <!-- <button @click="woreOutfit">I wore this today!</button> -->
  </div>
</template>

<style scoped>
h2 {
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
}
</style>
